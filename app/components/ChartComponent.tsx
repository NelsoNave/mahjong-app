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
  gameStats: GameStats;
}

const formatDate = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
};

export const ChartComponent = ({ gameStats }: ChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const { isFourPlayers } = useStatsStore();
  const [date, setDate] = useState<string[]>([]);
  const [income, setIncome] = useState<number[]>([]);
  const [expense, setExpense] = useState<number[]>([]);

  const getFinancialStat = () => {
    if (!gameStats) {
      return [];
    }
    return isFourPlayers
      ? gameStats.fourPlayerGameStats?.dailyStats || []
      : gameStats.threePlayerGameStats?.dailyStats || [];
  };

  const dailyStats = getFinancialStat();

  useEffect(() => {
    let dateData: string[] = [];
    let incomeData: number[] = [];
    let expenseData: number[] = [];

    dailyStats?.forEach((stat) => {
      dateData = [...dateData, formatDate(stat.date)];
      incomeData = [...incomeData, stat.income];
      expenseData = [...expenseData, stat.expense];
    });

    setDate(dateData);
    setIncome(incomeData);
    setExpense(expenseData);
  }, [gameStats, isFourPlayers]);

  useEffect(() => {
    if (date.length === 0 || income.length === 0 || expense.length === 0)
      return;

    const data = {
      labels: date,
      datasets: [
        {
          label: "総合",
          data: [-30000, 29999, 29999, 29999], // TODO: fetch total data
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
            max: 500000, // TODO: resolve error
            min: -200000,
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
          },
          // TODO: resolve error
          onHover: (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            target.style.cursor = "pointer";
          },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: TooltipItem<"line">) =>
              `${tooltipItem.raw} units`,
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

  return <canvas ref={chartRef}></canvas>;
};