"use client";

import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
  ChartEvent,
} from "chart.js";
import { useStatsStore } from "@/store/useStatsStore";
import { GameStats } from "@/types/game";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
);

interface ChartProps {
  gameStats: GameStats | null;
}

const formatDate = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
};

export const ChartComponent = ({ gameStats }: ChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const { isFourPlayers, isMonthlyView, targetDate } = useStatsStore();
  const [date, setDate] = useState<string[]>([]);
  const [income, setIncome] = useState<number[]>([]);
  const [expense, setExpense] = useState<number[]>([]);

  const getFinancialStat = () => {
    if (!gameStats) return [];
    return isFourPlayers
      ? gameStats.fourPlayerGameStats?.dailyStats || []
      : gameStats.threePlayerGameStats?.dailyStats || [];
  };

  const dailyStats = getFinancialStat();
  useEffect(() => {
    if (!dailyStats || dailyStats.length === 0) {
      setDate(["No Data"]);
      setIncome([0]);
      setExpense([0]);
      return;
    }

    let dateData: string[] = [];
    let incomeData: number[] = [];
    let expenseData: number[] = [];

    dailyStats.forEach((stat) => {
      dateData = [...dateData, formatDate(stat.date)];
      incomeData = [...incomeData, stat.income || 0];
      expenseData = [...expenseData, stat.expense || 0];
    });

    setDate(dateData);
    setIncome(incomeData);
    setExpense(expenseData);
  }, [isMonthlyView, targetDate, isFourPlayers]);

  useEffect(() => {
    if (date.length === 0 || income.length === 0 || expense.length === 0)
      return;

    const data = {
      labels: date,
      datasets: [
        {
          label: "総合",
          data: income.map((val, index) => val - expense[index]),
          borderColor: "#2D6B47",
          backgroundColor: "#2D6B47",
          fill: false,
          type: "line" as const,
          tension: 0.3,
          zIndex: 2,
        },
        {
          label: "収入",
          data: income,
          borderColor: "#A7C7E7",
          backgroundColor: "#A7C7E7",
          fill: true,
          type: "bar" as const,
          zIndex: 1,
        },
        {
          label: "支出",
          data: expense,
          borderColor: "#F1D0C5",
          backgroundColor: "#F1D0C5",
          fill: true,
          type: "bar" as const,
          zIndex: 1,
        },
      ],
    };

    const options: ChartOptions<"line" | "bar"> = {
      responsive: true,
      scales: {
        y: {
          stacked: true,
          ticks: {
            stepSize: 100000,
            callback: (tickValue: string | number) => `${tickValue}p`,
          },
        },
        x: {
          stacked: true,
          type: "category",
        },
      },
      plugins: {
        legend: {
          align: "end",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            font: {
              size: 12,
            },
          },
          onHover: (event: ChartEvent) => {
            const target = (event.native as MouseEvent).target as HTMLElement;
            if (target instanceof HTMLElement) {
              target.style.cursor = "pointer";
            }
          },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: TooltipItem<"line">) => `${tooltipItem.raw}p`,
          },
        },
      },
    };

    const ctx = chartRef.current?.getContext("2d");
    if (ctx) {
      const chart = new ChartJS(ctx, {
        data: data,
        options: options,
      });

      return () => {
        if (chart) chart.destroy();
      };
    }
  }, [date, income, expense]);

  return (
    <div>
      {date.length === 1 && date[0] === "No Data" ? (
        <p>データが存在しません</p>
      ) : (
        <canvas ref={chartRef}></canvas>
      )}
    </div>
  );
};
