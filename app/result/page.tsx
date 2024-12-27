"use client";

import { useState } from "react";
import Box from "@/components/Box";
import StatsSummary from "@/components/StatsSummaryCard";
import BalanceCard from "@/components/BalanceCard";
import TotalCostResultCard from "@/components/TotalCostResultCard";
import ChartComponent from "@/components/ChartComponent";

const Page = () => {
  const [incomeData, setIncomeData] = useState([50, 75, 100, 90]);
  const [expenseData, setExpenseData] = useState([30, 45, 60, 50]);
  const [lineData, setLineData] = useState([20, 40, 60, 50]);
  const [isFullChart, setIsFullChart] = useState(true);

  return (
    <div className="h-full">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <ChartComponent
          lineData={lineData}
          incomeData={incomeData}
          expenseData={expenseData}
          isFullChart={isFullChart}
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
