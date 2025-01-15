"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GameStats } from "@/types/game";
import { NumberOfPlayers } from "@prisma/client";
interface DailyStats {
  date: Date;
  total_score_change: number;
  income: number;
  expense: number;
}

const getDailyStats = async (
  userId: number,
  yearMonth: string,
  numberOfPlayers: NumberOfPlayers,
): Promise<DailyStats[]> => {
  const [year, month] = yearMonth.split("-").map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // 月末日

  const results = await prisma.$queryRaw<DailyStats[]>`
    SELECT
      g.id,
      DATE(g."playedAt") AS date,
      SUM(rr."scoreChange" * g.rate )::integer AS daily_total_income,
      SUM(rr."scoreChange")::integer AS daily_score,
      SUM(CASE WHEN rr."scoreChange" > 0 THEN rr."scoreChange" * g.rate ELSE 0 END)::integer AS daily_income,
      SUM(CASE WHEN rr."scoreChange" < 0 THEN rr."scoreChange" * g.rate ELSE 0 END)::integer AS daily_expence,
      SUM(CASE WHEN rr."rank" = 1 THEN 1 ELSE 0 END)::integer AS rank_1_cnt,
      SUM(CASE WHEN rr."rank" = 2 THEN 1 ELSE 0 END)::integer AS rank_2_cnt,
      SUM(CASE WHEN rr."rank" = 3 THEN 1 ELSE 0 END)::integer AS rank_3_cnt,
      SUM(CASE WHEN rr."rank" = 4 THEN 1 ELSE 0 END)::integer AS rank_4_cnt
    FROM games g
    JOIN rounds r ON g.id = r."gameId"
    JOIN round_results rr ON r.id = rr."roundId" AND rr."userId" = ${userId}
    WHERE 
      g."playedAt" >= ${startDate}
      AND g."playedAt" <= ${endDate}
      AND g."numberOfPlayers"::text = ${numberOfPlayers}::text
    GROUP BY g.id, DATE(g."playedAt")
    ORDER BY DATE(g."playedAt")
  `;

  // BigIntをnumberに変換
  return results;
};

export const getGameStats = async (
  yearMonth?: string,
): Promise<ActionState<GameStats>> => {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  // check yearMonth is valid
  if (yearMonth && !/^\d{4}-\d{2}$/.test(yearMonth)) {
    return { status: "error", message: "無効な年月が指定されました" };
  }

  try {
    const [year, month] = yearMonth ? yearMonth.split("-").map(Number) : [];
    const games = await prisma.game.findMany({
      where: {
        createdBy: Number(session.user.id),
        ...(yearMonth && {
          playedAt: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1),
          },
        }),
      },
      include: {
        chipResults: true,
        rounds: {
          include: {
            roundResults: true,
          },
        },
      },
    });

    const dailyStats = await getDailyStats(
      Number(session.user.id),
      yearMonth ? yearMonth : "",
      NumberOfPlayers.FOUR,
    );
    console.log(JSON.stringify(games, null, 2));
    console.log(JSON.stringify(dailyStats));
    // Classify games into 3-player and 4-player
    const threePlayerGames = games.filter((g) => g.numberOfPlayers === "THREE");
    const fourPlayerGames = games.filter((g) => g.numberOfPlayers === "FOUR");

    // Helper function to calculate stats
    const calculateStats = (games: typeof threePlayerGames) => {
      const rankCounts = { "1": 0, "2": 0, "3": 0, "4": 0 };
      let totalChips = 0;
      let totalScore = 0;
      let totalIncome = 0;
      let totalExpense = 0;
      let totalGameFee = 0;

      // Map for daily stats
      const dailyStatsMap = new Map<
        string,
        { income: number; expense: number }
      >();

      games.forEach((game) => {
        // Rank stats
        game.rounds.forEach((round) => {
          round.roundResults.forEach((result) => {
            if (result.userId === Number(session.user.id)) {
              rankCounts[result.rank.toString() as keyof typeof rankCounts]++;
              totalScore += result.scoreChange;
            }
          });
        });

        // Chip stats
        game.chipResults.forEach((result) => {
          if (result.userId === Number(session.user.id)) {
            totalChips += result.chipChange;
            if (result.chipChange > 0) {
              totalIncome += result.chipChange * game.chipRate;
            } else {
              totalExpense += Math.abs(result.chipChange) * game.chipRate;
            }
          }
        });

        // Daily stats
        const dateKey = game.playedAt.toISOString().split("T")[0];
        const dailyStats = dailyStatsMap.get(dateKey) || {
          income: 0,
          expense: 0,
        };
        game.chipResults.forEach((result) => {
          if (result.userId === Number(session.user.id)) {
            if (result.chipChange > 0) {
              dailyStats.income += result.chipChange * game.chipRate;
            } else {
              dailyStats.expense += Math.abs(result.chipChange) * game.chipRate;
            }
          }
        });
        dailyStatsMap.set(dateKey, dailyStats);

        totalGameFee += game.fee;
      });

      const totalGames = games.length;
      return {
        rankStats: {
          "1": {
            count: rankCounts["1"],
            percentage: (rankCounts["1"] / totalGames) * 100,
          },
          "2": {
            count: rankCounts["2"],
            percentage: (rankCounts["2"] / totalGames) * 100,
          },
          "3": {
            count: rankCounts["3"],
            percentage: (rankCounts["3"] / totalGames) * 100,
          },
          "4": {
            count: rankCounts["4"],
            percentage: (rankCounts["4"] / totalGames) * 100,
          },
        },
        performanceStats: {
          winRate: (rankCounts["1"] / totalGames) * 100,
          averageRank:
            Object.entries(rankCounts).reduce(
              (acc, [rank, count]) => acc + Number(rank) * count,
              0,
            ) / totalGames,
          totalChips,
          totalScore,
        },
        financialStats: {
          totalIncome,
          totalExpense,
          totalProfit: totalIncome - totalExpense,
          gameFee: totalGameFee,
          totalProfitIncludingGameFee:
            totalIncome - totalExpense - totalGameFee,
        },
        dailyStats: Array.from(dailyStatsMap.entries()).map(
          ([date, stats]) => ({
            date: new Date(date),
            income: stats.income,
            expense: stats.expense,
          }),
        ),
      };
    };

    return {
      status: "success",
      data: {
        threePlayerGameStats: calculateStats(threePlayerGames),
        fourPlayerGameStats: calculateStats(fourPlayerGames),
      },
      message: "統計情報の取得に成功しました",
    };
  } catch (error) {
    console.error("Failed to fetch game stats:", error);
    return {
      status: "error",
      message: "統計情報の取得に失敗しました",
    };
  }
};
