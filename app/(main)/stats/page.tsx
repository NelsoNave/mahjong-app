"use client";

import { useEffect, useState } from "react";
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
  // Todo : fetch the result data
  const [incomeData, setIncomeData] = useState([50, 75, 100, 90]);
  const [expenseData, setExpenseData] = useState([30, 45, 60, 50]);
  const [lineData, setLineData] = useState([20, 40, 60, 50]);
  const {
    gameStats,
    isMonthlyView,
    setMonthView,
    setOverallView,
    targetDate,
    setIsFourPlayers,
    setGameStats,
    setTargetDate,
    setAvailableDate,
  } = useStatsStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleMonthView = () => {
    setMonthView();
    setIsFourPlayers();
  };

  const handleOverallView = () => {
    setOverallView();
    setIsFourPlayers();
  };

  useEffect(() => {
    const fetchGameStats = async () => {
      try {
        const result = await getGameStats(isMonthlyView ? targetDate : "");

        if (result.status === "success") {
          alert("データの取得に成功しました");
          if (result.data) {
            setGameStats(result.data);
          }
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchGameStats();
  }, [targetDate]);

  useEffect(() => {
    setIsLoading(true);
    // TODO : server actionsで日付一覧を取得
    const availableDate: string[] = [
      "2024-01",
      "2024-05",
      "2024-06",
      "2024-11",
      "2024-12",
    ];

    const latestMonth = availableDate[availableDate.length - 1];
    setAvailableDate(availableDate);
    setTargetDate(latestMonth);

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <Header context="成績" />
      <div className="flex flex-col justify-between gap-2 px-6 py-2">
        <div className="flex w-[128px] justify-between rounded-xl bg-lightPineGlade px-2 py-1 text-black">
          <button
            className={`${
              isMonthlyView ? "bg-pineGlade font-semibold" : ""
            } rounded-lg px-3 transition-all duration-300`}
            onClick={handleMonthView}
          >
            月別
          </button>
          <button
            className={`${
              !isMonthlyView ? "bg-pineGlade font-semibold" : ""
            } rounded-lg px-3 transition-all duration-300`}
            onClick={handleOverallView}
          >
            総合
          </button>
        </div>
        {isMonthlyView && <MonthScroll />}
        <div className="flex flex-col gap-1">
          <Box>
            <ChartComponent gameStats={mockGameStats} />
          </Box>
          <Box>
            <StatsSummary gameStats={mockGameStats} />
          </Box>
          <div className="flex h-full gap-1">
            <Box size="sm">
              <BalanceCard gameStats={mockGameStats} />
            </Box>
            <Box size="sm">
              <TotalCostResultCard gameStats={mockGameStats} />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
