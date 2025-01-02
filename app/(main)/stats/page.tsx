"use client";

import { useState, useEffect } from "react";
import Box from "@/components/Box";
import StatsSummary from "@/components/StatsSummaryCard";
import BalanceCard from "@/components/BalanceCard";
import TotalCostResultCard from "@/components/TotalCostResultCard";
import ChartComponent from "@/components/ChartComponent";
import MonthScroll from "@/components/MonthScroll";
import { useStatsStore } from "@/store/useStatsStore";
import Header from "@/components/Header";
import { getGameStats } from "@/actions/gameStatsActions";
import { GameInfo, GameStats } from "@/types/game";

const Page = () => {
  // Todo : fetch the result data
  const [incomeData, setIncomeData] = useState([50, 75, 100, 90]);
  const [expenseData, setExpenseData] = useState([30, 45, 60, 50]);
  const [lineData, setLineData] = useState([20, 40, 60, 50]);
  const {
    isMonthlyView,
    setMonthView,
    setOverallView,
    targetDate,
    setIsFourPlayers,
    setGameStats,
  } = useStatsStore();

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
          alert("データの取得に失敗しました");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchGameStats();
  }, [targetDate, setGameStats, isMonthlyView]);

  return (
    <div className="h-full">
      <Header context="成績" />
      <div className="flex w-[128px] justify-between rounded-xl bg-lightPineGlade px-2 py-1 text-black">
        <button
          className={`${
            isMonthlyView ? "bg-pineGlade font-semibold" : ""
          } rounded-lg px-3 py-1 transition-all duration-300`}
          onClick={handleMonthView}
        >
          月別
        </button>
        <button
          className={`${
            !isMonthlyView ? "bg-pineGlade font-semibold" : ""
          } rounded-lg px-3 py-1 transition-all duration-300`}
          onClick={handleOverallView}
        >
          総合
        </button>
      </div>
      {isMonthlyView && <MonthScroll />}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <ChartComponent gameStats={gameStats} />
      </div>
      <Box>
        <StatsSummary gameStats={gameStats} />
      </Box>
      <div className="flex h-full">
        <Box size="sm">
          {isFourPlayers ? (
            <BalanceCard gameStats={gameStats} />
          ) : (
            <BalanceCard gameStats={gameStats} />
          )}
        </Box>
        <Box size="sm">
          <TotalCostResultCard gameStats={gameStats} />
        </Box>
      </div>
    </div>
  );
};

export default Page;
