"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GameStats } from "@/types/game";


export const getGameStats = async (yearMonth?: string): Promise<ActionState<GameStats>> => {
    const session = await auth();
    if (!session?.user?.email) {
      return { status: "error", message: "認証されていません" };
    }
  
    // check yearMonth is valid
    if (yearMonth && !/^\d{4}-\d{2}$/.test(yearMonth)) {
      return { status: "error", message: "無効な年月が指定されました" };
    }
  
    try {
      const [year, month] = yearMonth ? yearMonth.split('-').map(Number) : [];
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
  
      // Classify games into 3-player and 4-player
      const threePlayerGames = games.filter(g => g.numberOfPlayers === 'THREE');
      const fourPlayerGames = games.filter(g => g.numberOfPlayers === 'FOUR');
  
      // Helper function to calculate stats
      const calculateStats = (games: typeof threePlayerGames) => {
        const rankCounts = { "1": 0, "2": 0, "3": 0, "4": 0 };
        let totalChips = 0;
        let totalScore = 0;
        let totalIncome = 0;
        let totalExpense = 0;
        let totalGameFee = 0;
  
        // Map for daily stats
        const dailyStatsMap = new Map<string, { income: number; expense: number }>();
  
        games.forEach(game => {
          // Rank stats
          game.rounds.forEach(round => {
            round.roundResults.forEach(result => {
              if (result.userId === Number(session.user.id)) {
                rankCounts[result.rank.toString() as keyof typeof rankCounts]++;
                totalScore += result.scoreChange;
              }
            });
          });
  
          // Chip stats
          game.chipResults.forEach(result => {
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
          const dateKey = game.playedAt.toISOString().split('T')[0];
          const dailyStats = dailyStatsMap.get(dateKey) || { income: 0, expense: 0 };
          game.chipResults.forEach(result => {
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
            "1": { count: rankCounts["1"], percentage: (rankCounts["1"] / totalGames) * 100 },
            "2": { count: rankCounts["2"], percentage: (rankCounts["2"] / totalGames) * 100 },
            "3": { count: rankCounts["3"], percentage: (rankCounts["3"] / totalGames) * 100 },
            "4": { count: rankCounts["4"], percentage: (rankCounts["4"] / totalGames) * 100 },
          },
          performanceStats: {
            winRate: (rankCounts["1"] / totalGames) * 100,
            averageRank: Object.entries(rankCounts).reduce((acc, [rank, count]) => 
              acc + (Number(rank) * count), 0) / totalGames,
            totalChips,
            totalScore,
          },
          financialStats: {
            totalIncome,
            totalExpense,
            totalProfit: totalIncome - totalExpense,
            gameFee: totalGameFee,
            totalProfitIncludingGameFee: totalIncome - totalExpense - totalGameFee,
          },
          dailyStats: Array.from(dailyStatsMap.entries()).map(([date, stats]) => ({
            date: new Date(date),
            income: stats.income,
            expense: stats.expense,
          })),
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
      console.error('Failed to fetch game stats:', error);
      return {
        status: "error",
        message: "統計情報の取得に失敗しました",
      };
    }
  };