"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GameInfo } from "@/types/game";

// Get game info by year
export const getGameInfo = async (year: string): Promise<ActionState<GameInfo>> => {
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
      orderBy: {
        playedAt: "desc",
      },
    });

    const formattedGames: GameInfo[] = games.map(game => ({
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
      chipResults: game.chipResults.map(result => ({
        userId: result.userId,
        name: result.user?.userName ?? "Unknown",
        chipChange: result.chipChange,
      })),
      rounds: game.rounds.map(round => ({
        id: round.id,
        roundNumber: round.roundNumber,
        results: round.roundResults.map(result => ({
          userId: result.userId!,
          name: result.user?.userName ?? "Unknown",
          scoreChange: result.scoreChange,
          rank: result.rank,
          position: result.position,
        })),
      })),
    }));

    return {
      status: "success",
      items: formattedGames,
      message: "ゲーム情報の取得に成功しました",
    };
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return {
      status: "error",
      message: "ゲーム情報の取得に失敗しました",
    };
  }
}


// Get game info
export const getGameInfoById = async (id: number): Promise<ActionState<GameInfo>> => {
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
      chipResults: game.chipResults.map(result => ({
        userId: result.userId,
        name: result.user?.userName ?? "Unknown",
        chipChange: result.chipChange,
      })),
      rounds: game.rounds.map(round => ({
        id: round.id,
        roundNumber: round.roundNumber,
        results: round.roundResults.map(result => ({
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
    console.error('Failed to fetch games:', error);
    return {
      status: "error",
      message: "ゲーム情報の取得に失敗しました",
    };
  }
};

// Create game
export const createGame = async (gameInfo: Omit<GameInfo, "id" | "createdBy">): Promise<ActionState<GameInfo>> => {
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
        data: gameInfo.chipResults.map(result => ({
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
          data: round.results.map(result => ({
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
    console.error('Failed to create game:', error);
    return {
      status: "error",
      message: "ゲームの作成に失敗しました",
    };
  }
};



export const updateGame = async (
  id: number,
  gameInfo: Partial<Omit<GameInfo, "id" | "createdBy">>
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
          data: gameInfo.chipResults.map(result => ({
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
            data: round.results.map(result => ({
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
    console.error('Failed to update game:', error);
    return {
      status: "error",
      message: "ゲームの更新に失敗しました",
    };
  }
};
