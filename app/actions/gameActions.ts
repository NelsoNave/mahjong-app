"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GameInfo, GameHistory } from "@/types/game";

/**
 * Gets game information for a specific year. call from history page
 * @param {string} year - The year to get game info for (e.g. "2024")
 * @returns {Promise<ActionState<GameInfo>>} Game information including rounds, chip results and user details
 * @throws {Error} If user is not authenticated or year is invalid
 */
export const getGameInfo = async (
  year: string,
): Promise<ActionState<GameHistory>> => {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  // check year is valid
  if (!year || isNaN(Number(year))) {
    return { status: "error", message: "無効な年が指定されました" };
  }

  try {
    const games = await prisma.game.findMany({
      where: {
        createdBy: Number(session.user.id),
        ...(year && {
          playedAt: {
            gte: new Date(Number(year), 0, 1),
            lt: new Date(Number(year) + 1, 0, 1),
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
          },
        },
        chipResults: {
          where: {
            userId: Number(session.user.id),
          },
          select: {
            chipChange: true,
          },
        },
        rounds: {
          where: {
            roundResults: {
              some: {
                userId: Number(session.user.id),
              },
            },
          },
          select: {
            id: true,
            roundNumber: true,
            roundResults: {
              where: {
                userId: Number(session.user.id),
              },
              select: {
                userId: true,
                scoreChange: true,
                rank: true,
              },
            },
          },
        },
      },
      orderBy: {
        playedAt: "desc",
      },
    });

    const formattedGames: GameHistory[] = games.map((game) => {
      // Calculate rank counts
      const rankCounts = game.rounds.reduce(
        (acc, round) => {
          const rank = round.roundResults[0]?.rank;
          if (rank) {
            acc[rank.toString() as keyof typeof acc] += 1;
          }
          return acc;
        },
        { "1": 0, "2": 0, "3": 0, "4": 0 },
      );

      // Calculate average rank
      const totalRanks = game.rounds.reduce(
        (sum, round) => sum + (round.roundResults[0]?.rank ?? 0),
        0,
      );
      const averageRank =
        game.rounds.length > 0
          ? Number((totalRanks / game.rounds.length).toFixed(2))
          : 0;

      // Calculate total chips and score
      const totalChips = game.chipResults.reduce(
        (sum, result) => sum + result.chipChange,
        0,
      );
      const totalScore = game.rounds.reduce(
        (sum, round) => sum + (round.roundResults[0]?.scoreChange ?? 0),
        0,
      );

      return {
        id: game.id,
        gameType: game.gameType,
        numberOfPlayers: game.numberOfPlayers,
        playedAt: game.playedAt,
        rankCounts,
        averageRank,
        totalChips,
        totalScore,
        createUserName: game.user.userName,
      };
    });

    return {
      status: "success",
      items: formattedGames,
      message: "ゲーム情報の取得に成功しました",
    };
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return {
      status: "error",
      message: "ゲーム情報の取得に失敗しました",
    };
  }
};

// Get game info
export const getGameInfoById = async (
  id: number,
): Promise<ActionState<GameInfo>> => {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  try {
    const game = await prisma.game.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
          },
        },
        chipResults: {
          select: {
            userId: true,
            user: {
              select: {
                userName: true,
              },
            },
            chipChange: true,
          },
        },
        rounds: {
          select: {
            id: true,
            roundNumber: true,
            roundResults: {
              select: {
                userId: true,
                user: {
                  select: {
                    userName: true,
                  },
                },
                scoreChange: true,
                rank: true,
                position: true,
              },
            },
          },
        },
      },
    });
    if (!game) {
      return { status: "error", message: "ゲームが見つかりません" };
    }

    const formattedGames: GameInfo = {
      id: game.id,
      gameType: game.gameType,
      numberOfPlayers: game.numberOfPlayers,
      playedAt: game.playedAt,
      rate: game.rate,
      chipRate: game.chipRate,
      fee: game.fee,
      createdBy: {
        userId: game.user.id,
        name: game.user.userName,
      },
      chipResults: game.chipResults.map((result) => ({
        userId: result.userId,
        name: result.user?.userName ?? "Unknown",
        chipChange: result.chipChange,
      })),
      rounds: game.rounds.map((round) => ({
        id: round.id,
        roundNumber: round.roundNumber,
        results: round.roundResults.map((result) => ({
          userId: result.userId!,
          name: result.user?.userName ?? "Unknown",
          scoreChange: result.scoreChange,
          rank: result.rank,
          position: result.position,
        })),
      })),
    };

    return {
      status: "success",
      data: formattedGames,
      message: "ゲーム情報の取得に成功しました",
    };
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return {
      status: "error",
      message: "ゲーム情報の取得に失敗しました",
    };
  }
};

// Create game
export const createGame = async (
  gameInfo: Omit<GameInfo, "id" | "createdBy">,
): Promise<ActionState<GameInfo>> => {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create game
      const game = await tx.game.create({
        data: {
          gameType: gameInfo.gameType,
          numberOfPlayers: gameInfo.numberOfPlayers,
          playedAt: gameInfo.playedAt,
          rate: gameInfo.rate,
          chipRate: gameInfo.chipRate,
          fee: gameInfo.fee,
          createdBy: Number(session.user.id),
        },
      });

      // 2. Create chip results
      await tx.chipResults.createMany({
        data: gameInfo.chipResults.map((result) => ({
          gameId: game.id,
          userId: result.userId,
          chipChange: result.chipChange,
        })),
      });

      // 3. Create rounds and round results
      for (const round of gameInfo.rounds) {
        const createdRound = await tx.rounds.create({
          data: {
            gameId: game.id,
            roundNumber: round.roundNumber,
          },
        });

        await tx.roundResults.createMany({
          data: round.results.map((result) => ({
            roundId: createdRound.id,
            userId: result.userId,
            position: result.position,
            scoreChange: result.scoreChange,
            rank: result.rank,
          })),
        });
      }

      return game;
    });

    return {
      status: "success",
      data: (await getGameInfoById(result.id)).data,
      message: "ゲームの作成に成功しました",
    };
  } catch (error) {
    console.error("Failed to create game:", error);
    return {
      status: "error",
      message: "ゲームの作成に失敗しました",
    };
  }
};

export const updateGame = async (
  id: number,
  gameInfo: Partial<Omit<GameInfo, "id" | "createdBy">>,
): Promise<ActionState<GameInfo>> => {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  try {
    // Check if game exists and user has permission
    const existingGame = await prisma.game.findUnique({
      where: { id },
      select: { createdBy: true },
    });

    if (!existingGame) {
      return { status: "error", message: "ゲームが見つかりません" };
    }

    if (existingGame.createdBy !== Number(session.user.id)) {
      return { status: "error", message: "更新権限がありません" };
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update game base info
      const game = await tx.game.update({
        where: { id },
        data: {
          gameType: gameInfo.gameType,
          numberOfPlayers: gameInfo.numberOfPlayers,
          playedAt: gameInfo.playedAt,
          rate: gameInfo.rate,
          chipRate: gameInfo.chipRate,
          fee: gameInfo.fee,
        },
      });

      // 2. Update chip results if provided
      if (gameInfo.chipResults) {
        // Delete existing chip results
        await tx.chipResults.deleteMany({
          where: { gameId: id },
        });
        // Create new chip results
        await tx.chipResults.createMany({
          data: gameInfo.chipResults.map((result) => ({
            gameId: game.id,
            userId: result.userId,
            chipChange: result.chipChange,
          })),
        });
      }

      // 3. Update rounds and results if provided
      if (gameInfo.rounds) {
        // Delete existing rounds and their results
        const existingRounds = await tx.rounds.findMany({
          where: { gameId: id },
          select: { id: true },
        });

        for (const round of existingRounds) {
          await tx.roundResults.deleteMany({
            where: { roundId: round.id },
          });
        }

        await tx.rounds.deleteMany({
          where: { gameId: id },
        });

        // Create new rounds and results
        for (const round of gameInfo.rounds) {
          const createdRound = await tx.rounds.create({
            data: {
              gameId: game.id,
              roundNumber: round.roundNumber,
            },
          });

          await tx.roundResults.createMany({
            data: round.results.map((result) => ({
              roundId: createdRound.id,
              userId: result.userId,
              position: result.position,
              scoreChange: result.scoreChange,
              rank: result.rank,
            })),
          });
        }
      }

      return game;
    });

    return {
      status: "success",
      data: (await getGameInfoById(result.id)).data,
      message: "ゲームの更新に成功しました",
    };
  } catch (error) {
    console.error("Failed to update game:", error);
    return {
      status: "error",
      message: "ゲームの更新に失敗しました",
    };
  }
};
