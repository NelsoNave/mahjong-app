"use client";

import { useEffect } from "react";
import Box from "@/components/Box";
import StatsSummary from "@/components/StatsSummaryCard";
import BalanceCard from "@/components/BalanceCard";
import TotalCostResultCard from "@/components/TotalCostResultCard";
import { ChartComponent } from "@/components/ChartComponent";
import MonthScroll from "@/components/MonthScroll";
import { useStatsStore } from "@/store/useStatsStore";
import Header from "@/components/Header";
import { getGameStats } from "@/actions/gameStatsActions";
import { GameStats } from "@/types/game";

const Page = () => {
  // dummy stats data list
  const mockGameStats: GameStats = {
    threePlayerGameStats: {
      rankStats: {
        "1": { count: 10, percentage: 33 },
        "2": { count: 15, percentage: 50 },
        "3": { count: 5, percentage: 17 },
      },
      performanceStats: {
        winRate: 0.33,
        averageRank: 2.1,
        totalChips: 5000,
        totalScore: 1500,
      },
      financialStats: {
        totalIncome: 100000,
        totalExpense: 50000,
        totalProfit: 50000,
        gameFee: 5000,
        totalProfitIncludingGameFee: 45000,
      },
      dailyStats: [
        { date: new Date("2024-01-01"), income: 50000, expense: 20000 },
        { date: new Date("2024-01-02"), income: 55000, expense: 22000 },
        { date: new Date("2024-01-03"), income: -60000, expense: 25000 },
        { date: new Date("2024-01-04"), income: 62000, expense: 26000 },
        { date: new Date("2024-01-05"), income: -63000, expense: 27000 },
      ],
    },
    fourPlayerGameStats: {
      rankStats: {
        "1": { count: 10, percentage: 25 },
        "2": { count: 15, percentage: 37.5 },
        "3": { count: 10, percentage: 25 },
        "4": { count: 5, percentage: 12.5 },
      },
      performanceStats: {
        winRate: 55,
        averageRank: 2.25,
        totalChips: -4000,
        totalScore: 1400,
      },
      financialStats: {
        totalIncome: 90000,
        totalExpense: 40000,
        totalProfit: 50000,
        gameFee: 4000,
        totalProfitIncludingGameFee: 46000,
      },
      dailyStats: [
        { date: new Date("2024-01-01"), income: 100000, expense: 18000 },
        { date: new Date("2024-01-02"), income: -42000, expense: 19000 },
        { date: new Date("2024-01-03"), income: 45000, expense: 21000 },
        { date: new Date("2024-01-04"), income: 46000, expense: 22000 },
        { date: new Date("2024-01-05"), income: 47000, expense: 23000 },
      ],
    },
  };

  const {
    gameStats,
    isMonthlyView,
    setMonthView,
    setOverallView,
    targetDate,
    isStatsLoading,
    setIsFourPlayers,
    setGameStats,
    setTargetDate,
    setAvailableDate,
    setIsStatsLoading,
  } = useStatsStore();

  const handleMonthView = () => {
    setMonthView();
    setIsFourPlayers();
  };

  const handleOverallView = () => {
    setOverallView();
    setIsFourPlayers();
  };

  const fetchGameStats = async () => {
    if (!targetDate) return;
    setIsStatsLoading(true);

    try {
      const statsData = await getGameStats(isMonthlyView ? targetDate : "");
      if (statsData.status === "success" && statsData.data) {
        setGameStats(statsData.data);
      } else {
        alert(statsData.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    if (targetDate) return;
    setIsStatsLoading(true);

    // TODO: fetch available date data
    // dummy data
    const availableDate: string[] = [
      "2024-01",
      "2024-05",
      "2024-06",
      "2024-11",
      "2024-12",
    ];

    setAvailableDate(availableDate);

    // get the latest month
    const latestMonth = availableDate[availableDate.length - 1];
    setTargetDate(latestMonth);

    setIsStatsLoading(false);
  }, []);

  useEffect(() => {
    if (!targetDate) return;
    fetchGameStats();
  }, [targetDate, isMonthlyView]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-50 bg-background">
        <Header context="成績" />
      </div>
      <div
        className={`${isStatsLoading && "h-full items-center justify-center"} flex flex-col overflow-y-auto bg-background`}
      >
        {isStatsLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex min-h-screen flex-col gap-2 border px-6 py-4">
            <div className="flex w-[136px] justify-between rounded-xl bg-lightPineGlade px-2 py-[5px] text-black">
              <button
                className={`${isMonthlyView ? "bg-pineGlade font-semibold" : ""} rounded-lg px-3 py-[2px] transition-all duration-300`}
                onClick={handleMonthView}
              >
                月別
              </button>
              <button
                className={`${!isMonthlyView ? "bg-pineGlade font-semibold" : ""} rounded-lg px-3 py-[2px] transition-all duration-300`}
                onClick={handleOverallView}
              >
                総合
              </button>
            </div>
            {isMonthlyView && <MonthScroll />}
            <div className="flex flex-col gap-2">
              <Box>
                <ChartComponent gameStats={mockGameStats} />
              </Box>
              <Box>
                <StatsSummary gameStats={mockGameStats} />
              </Box>
              <div className="flex gap-2">
                <Box size="sm">
                  <BalanceCard gameStats={mockGameStats} />
                </Box>
                <Box size="sm">
                  <TotalCostResultCard gameStats={mockGameStats} />
                </Box>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
