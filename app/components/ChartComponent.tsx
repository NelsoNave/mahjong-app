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
} from "chart.js";
import { GameStats } from "@/types/game";
import { useStatsStore } from "@/store/useStatsStore";

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

const ChartComponent = ({ gameStats }: ChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const { isFourPlayers } = useStatsStore();
  const [date, setDate] = useState<Date[]>([]);
  const [income, setIncome] = useState<number[]>([]);
  const [expense, setExpense] = useState<number[]>([]);

  const getFinancialStat = () => {
    return isFourPlayers
      ? gameStats.fourPlayerGameStats.dailyStats
      : gameStats.threePlayerGameStats.dailyStats;
  };

  const dailyStats = getFinancialStat();

  useEffect(() => {
    let dateData: Date[] = [];
    let incomeData: number[] = [];
    let expenseData: number[] = [];

    dailyStats.map((stat) => {
      dateData = [...dateData, stat.date];
      incomeData = [...incomeData, stat.income];
      expenseData = [...expenseData, stat.expense];

      setDate(dateData);
      setIncome(incomeData);
      setExpense(expenseData);
    });

    const data = {
      labels: date,

      datasets: [
        {
          label: "総合",
          data: [23, 11, 33, 44], // TODO: 総合データが用意され次第
          borderColor: "#2D6B47",
          backgroundColor: "#2D6B47",
          fill: false,
          type: "line",
          tension: 0.3,
          zIndex: 2,
        },

        {
          label: "収入",
          data: income,
          borderColor: "#A7C7E7",
          backgroundColor: "#A7C7E7",
          fill: true,
          type: "bar",
          zIndex: 1,
        },
        {
          label: "支出",
          data: expense,
          borderColor: "#F1D0C5",
          backgroundColor: "#F1D0C5",
          fill: true,
          type: "bar",
          zIndex: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      scales: {
        y: {
          stacked: true,
          ticks: {
            beginAtZero: false,
            max: 500000,
            min: -200000,
            stepSize: 100000,
            callback: (value: number) => `${value}p`,
          },
        },
        x: {
          stacked: true,
        },
      },
      plugins: {
        legend: {
          align: "end",
          labels: {
            usePointStyle: true,
          },
          onHover: (event, legendItem) => {
            event.target.style.cursor = "pointer";
          },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => `${tooltipItem.raw} units`,
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
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;
