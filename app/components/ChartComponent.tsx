"use client";

import { useEffect, useRef } from "react";
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
  lineData: number[];
  incomeData: number[];
  expenseData: number[];
  isFullChart: boolean;
}

const ChartComponent = ({
  lineData,
  incomeData,
  expenseData,
  isFullChart,
}: ChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const data = {
      labels: ["12/24", "12/26", "12/27", "12/28"],
      datasets: [
        {
          label: "総合",
          data: lineData,
          borderColor: "#2D6B47",
          backgroundColor: "#2D6B47",
          fill: false,
          type: "line",
          tension: 0.3,
          zIndex: 2,
        },
        ...(isFullChart
          ? [
              {
                label: "収入",
                data: incomeData,
                borderColor: "#A7C7E7",
                backgroundColor: "#A7C7E7",
                fill: true,
                type: "bar",
                zIndex: 1,
              },
              {
                label: "支出",
                data: expenseData,
                borderColor: "#F1D0C5",
                backgroundColor: "#F1D0C5",
                fill: true,
                type: "bar",
                zIndex: 1,
              },
            ]
          : []),
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
  }, [lineData, incomeData, expenseData, isFullChart]);

  return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;
