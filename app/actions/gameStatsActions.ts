"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { GameStats } from "@/types/game";
import { NumberOfPlayers } from "@prisma/client";
interface DailyStats {
  date: Date;
  total_score_change: number;
  income: number;
  expense: number;
}

interface RankStats {
  rank: number;
  count: number;
  percentage: number;
}

interface FinancialStats {
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  gameFee: number;
  totalProfitIncludingGameFee: number;
}

const basicStatsQuery = (
  userId: number,
  yearMonth: string | undefined,
  numberOfPlayers: NumberOfPlayers,
): string => {
  let dateCondition = "";

  if (yearMonth) {
    const [year, month] = yearMonth.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();
    dateCondition = `
      AND g."playedAt" >= '${startDate}'
      AND g."playedAt" <= '${endDate}'
    `;
  }

  return `
    WITH base_stats AS (
      SELECT
        g.id as game_id,
        DATE(g."playedAt") as played_date,
        rr."rank",
        rr."scoreChange",
        g.rate,
        g.fee,
        ROW_NUMBER() OVER (PARTITION BY g.id) as row_num
      FROM games g
      JOIN rounds r ON g.id = r."gameId"
      JOIN round_results rr ON r.id = rr."roundId"
      WHERE 
        rr."userId" = ${userId}
        ${dateCondition}
        AND g."numberOfPlayers"::text = '${numberOfPlayers}'::text
    )
  `;
};

export const getRankStats = async (
  userId: number,
  yearMonth: string | undefined,
  numberOfPlayers: NumberOfPlayers,
): Promise<RankStats[]> => {
  const query = `
    ${basicStatsQuery(userId, yearMonth, numberOfPlayers)}
    , ranks AS (
      SELECT generate_series(1, 4) as rank
    )
    , rank_counts AS (
      SELECT
        r.rank,
        COUNT(bs.rank)::integer as count
      FROM ranks r
      LEFT JOIN base_stats bs ON bs.rank = r.rank
      GROUP BY r.rank
    )
    SELECT 
      rank,
      count,
      ROUND(
        count * 100.0 / NULLIF((SELECT SUM(count) FROM rank_counts), 0),
        2
      ) as percentage
    FROM rank_counts
    ORDER BY rank
  `;

  const results = await prisma.$queryRaw`${Prisma.raw(query)}`;
  return results as RankStats[];
};

export const getFinancialStats = async (
  userId: number,
  yearMonth: string | undefined,
  numberOfPlayers: NumberOfPlayers,
): Promise<FinancialStats> => {
  const query = `
    ${basicStatsQuery(userId, yearMonth, numberOfPlayers)}
    SELECT
      COALESCE(SUM(
        CASE WHEN "scoreChange" * rate > 0 
        THEN "scoreChange" * rate 
        ELSE 0 END
      )::integer, 0) AS "totalIncome",
      COALESCE(ABS(SUM(
        CASE WHEN "scoreChange" * rate < 0 
        THEN "scoreChange" * rate 
        ELSE 0 END
      ))::integer, 0) AS "totalExpense",
      COALESCE(SUM("scoreChange" * rate)::integer, 0) AS "totalProfit",
      COALESCE(SUM(CASE WHEN row_num = 1 THEN fee ELSE 0 END)::integer, 0) AS "totalGameFee",
      COALESCE((
        SUM("scoreChange" * rate) - 
        SUM(CASE WHEN row_num = 1 THEN fee ELSE 0 END)
      )::integer, 0) AS "totalProfitIncludingGameFee"
    FROM base_stats
  `;

  const results = await prisma.$queryRaw`${Prisma.raw(query)}`;
  const stats = results as FinancialStats[];
  return stats[0];
};

export const getDailyStats = async (
  userId: number,
  yearMonth: string | undefined,
  numberOfPlayers: NumberOfPlayers,
): Promise<DailyStats[]> => {
  const query = `
    ${basicStatsQuery(userId, yearMonth, numberOfPlayers)}
    SELECT
      played_date as date,
      SUM("scoreChange" * rate)::integer as total_score_change,
      SUM(CASE WHEN "scoreChange" * rate > 0 THEN "scoreChange" * rate ELSE 0 END)::integer as income,
      SUM(CASE WHEN "scoreChange" * rate < 0 THEN "scoreChange" * rate ELSE 0 END)::integer as expense
    FROM base_stats
    GROUP BY played_date
    ORDER BY played_date
  `;

  const results = await prisma.$queryRaw`${Prisma.raw(query)}`;
  return (results as DailyStats[]).map((row) => ({
    date: row.date,
    total_score_change: Number(row.total_score_change),
    income: Number(row.income),
    expense: Number(row.expense),
  }));
};

export const getGameStats = async (
  yearMonth?: string,
): Promise<ActionState<GameStats>> => {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  if (yearMonth && !/^\d{4}-\d{2}$/.test(yearMonth)) {
    return { status: "error", message: "無効な年月が指定されました" };
  }

  try {
    const rankStats = await getRankStats(
      Number(session.user.id),
      yearMonth,
      NumberOfPlayers.FOUR,
    );
    const dailyStats = await getDailyStats(
      Number(session.user.id),
      yearMonth,
      NumberOfPlayers.FOUR,
    );
    const financialStats = await getFinancialStats(
      Number(session.user.id),
      yearMonth,
      NumberOfPlayers.FOUR,
    );

    console.log("rankStats:", rankStats);
    console.log("dailyStats:", dailyStats);
    console.log("financialStats:", financialStats);

    return {
      status: "success",
      data: {
        fourPlayerGameStats: {
          //rankStats,
          //dailyStats,
          financialStats: financialStats,
        },
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
