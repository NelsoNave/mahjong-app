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
        g."numberOfPlayers",
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
    )
  `;
};

export const getRankStats = async (
  userId: number,
  yearMonth: string | undefined,
): Promise<Record<NumberOfPlayers, RankStats[]>> => {
  const query = `
    ${basicStatsQuery(userId, yearMonth)}
    , ranks AS (
      SELECT generate_series(1, 4) as rank
    )
    , rank_counts AS (
      SELECT
        bs."numberOfPlayers",
        r.rank,
        COUNT(bs.rank)::integer as count
      FROM ranks r
      CROSS JOIN (SELECT DISTINCT "numberOfPlayers" FROM base_stats) np
      LEFT JOIN base_stats bs ON bs.rank = r.rank AND bs."numberOfPlayers" = np."numberOfPlayers"
      GROUP BY bs."numberOfPlayers", r.rank
    )
    SELECT 
      "numberOfPlayers",
      rank,
      count,
      ROUND(
        count * 100.0 / NULLIF((
          SELECT SUM(count) 
          FROM rank_counts rc2 
          WHERE rc2."numberOfPlayers" = rc1."numberOfPlayers"
        ), 0),
        2
      ) as percentage
    FROM rank_counts rc1
    ORDER BY "numberOfPlayers", rank
  `;

  const results = await prisma.$queryRaw<
    (RankStats & { numberOfPlayers: NumberOfPlayers })[]
  >`${Prisma.raw(query)}`;

  // Group results by numberOfPlayers
  return results.reduce(
    (acc, stat) => {
      const { numberOfPlayers, ...rankStat } = stat;
      if (!acc[numberOfPlayers]) {
        acc[numberOfPlayers] = [];
      }
      acc[numberOfPlayers].push(rankStat);
      return acc;
    },
    {} as Record<NumberOfPlayers, RankStats[]>,
  );
};

export const getFinancialStats = async (
  userId: number,
  yearMonth: string | undefined,
): Promise<Record<NumberOfPlayers, FinancialStats>> => {
  const query = `
    ${basicStatsQuery(userId, yearMonth)}
    SELECT
      "numberOfPlayers",
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
    GROUP BY "numberOfPlayers"
  `;

  const results = await prisma.$queryRaw<
    (FinancialStats & { numberOfPlayers: NumberOfPlayers })[]
  >`${Prisma.raw(query)}`;

  // Convert array to record with numberOfPlayers as keys
  return results.reduce(
    (acc, stat) => {
      const { numberOfPlayers, ...stats } = stat;
      acc[numberOfPlayers] = stats;
      return acc;
    },
    {} as Record<NumberOfPlayers, FinancialStats>,
  );
};

export const getDailyStats = async (
  userId: number,
  yearMonth: string | undefined,
): Promise<DailyStats[]> => {
  const query = `
    ${basicStatsQuery(userId, yearMonth)}
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
    const rankStats = await getRankStats(Number(session.user.id), yearMonth);
    const dailyStats = await getDailyStats(Number(session.user.id), yearMonth);
    const financialStats = await getFinancialStats(
      Number(session.user.id),
      yearMonth,
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
          financialStats: financialStats.FOUR,
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

/**
 * Gets available months that have game records for the authenticated user
 * @returns {Promise<string[]>} Array of months in YYYY-MM format, sorted chronologically
 * @example
 * // Returns months like:
 * ["2024-01", "2024-02", "2024-03"]
 */
export const getAvailableMonths = async (): Promise<string[]> => {
  const session = await auth();
  if (!session?.user?.email) {
    return [];
  }

  const query = `
    SELECT DISTINCT
      TO_CHAR(g."playedAt", 'YYYY-MM') as month
    FROM games g
    WHERE g."createdBy" = ${Number(session.user.id)}
    ORDER BY month
  `;

  try {
    const results = await prisma.$queryRaw<
      { month: string }[]
    >`${Prisma.raw(query)}`;
    return results.map((r) => r.month);
  } catch (error) {
    console.error("Failed to fetch available months:", error);
    return [];
  }
};
