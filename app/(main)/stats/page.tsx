"use client";

import { useState } from "react";
import Box from "@/components/Box";
import StatsSummary from "@/components/StatsSummaryCard";
import BalanceCard from "@/components/BalanceCard";
import TotalCostResultCard from "@/components/TotalCostResultCard";
import ChartComponent from "@/components/ChartComponent";
import MonthScroll from "@/components/MonthScroll";
import { useStatsStore } from "@/store/useStatsStore";
import Header from "@/components/Header";

const Page = () => {
  // Todo : fetch the result data
  const [incomeData, setIncomeData] = useState([50, 75, 100, 90]);
  const [expenseData, setExpenseData] = useState([30, 45, 60, 50]);
  const [lineData, setLineData] = useState([20, 40, 60, 50]);
  const { isMonthlyView, setMonthView, setOverallView } = useStatsStore();

  return (
    <div className="h-full">
      <Header context="成績" />
      <div className="flex w-[128px] justify-between rounded-xl bg-lightPineGlade px-2 py-1 text-black">
        <button
          className={`${
            isMonthlyView ? "bg-pineGlade font-semibold" : ""
          } rounded-lg px-3 py-1 transition-all duration-300`}
          onClick={() => setMonthView()}
        >
          月別
        </button>
        <button
          className={`${
            !isMonthlyView ? "bg-pineGlade font-semibold" : ""
          } rounded-lg px-3 py-1 transition-all duration-300`}
          onClick={() => setOverallView()}
        >
          総合
        </button>
      </div>
      {isMonthlyView && <MonthScroll />}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <ChartComponent
          lineData={lineData}
          incomeData={incomeData}
          expenseData={expenseData}
          isFullChart={isMonthlyView}
        />
      </div>
      <Box>
        <StatsSummary />
      </Box>
      <div className="flex h-full">
        <Box size="sm">
          <BalanceCard />
        </Box>
        <Box size="sm">
          <TotalCostResultCard />
        </Box>
      </div>
    </div>
  );
};

export default Page;
