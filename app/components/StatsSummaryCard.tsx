import React from "react";
import { useStatsStore } from "@/store/useStatsStore";
import { GameStats } from "@/types/game";

type CountProps = {
  rank: number;
  count: number;
  percentage: number;
};

type PerformanceProps = {
  label: string;
  performance: number;
  unit?: string;
};

type StatsSummaryProps = {
  gameStats: GameStats | null;
};

// ranking
const RankStats = ({ rank, count, percentage }: CountProps) => (
  <div className="flex w-full flex-col">
    <p className="text-sm">{rank}着</p>
    <div className="flex flex-col items-center">
      <div className="flex w-1/2 items-center justify-center">
        <span className="pr-1 text-lg font-semibold">{count}</span>
        <span>回</span>
      </div>
      <p
        className={`w-2/3 rounded-xl text-center text-sm ${
          (rank === 1 || rank === 2) && percentage >= 25
            ? "bg-zombie"
            : (rank === 3 || rank === 4) && percentage >= 25
              ? "bg-lightBlue"
              : ""
        }`}
      >
        {percentage}%
      </p>
    </div>
  </div>
);

const Performance = ({ label, performance, unit }: PerformanceProps) => {
  const displayPerformance =
    label === "総得点" && performance >= 1 ? `+${performance}` : performance;
  const performanceColor =
    (label === "連帯率" && performance >= 50) ||
    (label === "総チップ" && performance >= 1) ||
    (label === "総得点" && performance >= 1)
      ? "text-denim"
      : "";

  return (
    <div className="flex justify-between rounded-md border-0.5 border-gray-400 p-2">
      <p>{label}</p>
      <div className="flex gap-1 font-semibold">
        <p className={performanceColor}>{displayPerformance}</p>
        <p>{unit}</p>
      </div>
    </div>
  );
};

const StatsSummaryCard = ({ gameStats }: StatsSummaryProps) => {
  const { isFourPlayers, setIsThreePlayers, setIsFourPlayers } =
    useStatsStore();

  const getFinancialStat = () => {
    if (!gameStats) {
      return null;
    }
    return isFourPlayers
      ? gameStats.fourPlayerGameStats
      : gameStats.threePlayerGameStats;
  };

  const summaryStats = getFinancialStat();

  const performanceData = summaryStats
    ? [
        {
          label: "連帯率",
          value: summaryStats.performanceStats.winRate,
          unit: "%",
        },
        { label: "平均着順", value: summaryStats.performanceStats.averageRank },
        {
          label: "総チップ",
          value: summaryStats.performanceStats.totalChips,
          unit: "枚",
        },
        { label: "総得点", value: summaryStats.performanceStats.totalScore },
      ]
    : [];

  return (
    <div className="flex flex-col gap-2">
      {/* switch game types */}
      <div className="flex gap-2">
        <button
          className="flex items-center gap-1 rounded-lg"
          onClick={() => setIsFourPlayers()}
        >
          <span
            className={`h-3 w-3 rounded-full ${isFourPlayers ? "bg-amazon" : "bg-gray-400"}`}
          ></span>
          <span
            className={`text-sm ${isFourPlayers ? "font-semibold" : "font-medium"}`}
          >
            4人麻雀
          </span>
        </button>
        <button
          className="flex items-center gap-1 rounded-lg"
          onClick={() => setIsThreePlayers()}
        >
          <span
            className={`h-3 w-3 rounded-full ${!isFourPlayers ? "bg-amazon" : "bg-gray-400"}`}
          ></span>
          <span
            className={`text-sm ${isFourPlayers ? "font-medium" : "font-semibold"}`}
          >
            3人麻雀
          </span>
        </button>
      </div>

      {/* ranking */}
      <div className="flex justify-between gap-5">
        {summaryStats?.rankStats &&
          Object.entries(summaryStats.rankStats).map(([rank, stats], index) => (
            <RankStats
              key={index}
              rank={Number(rank)}
              count={stats.count}
              percentage={stats.percentage}
            />
          ))}
      </div>

      {/* performance */}
      <div className="grid grid-cols-2 gap-1">
        {performanceData.map((data, index) => (
          <Performance
            key={index}
            label={data.label}
            performance={data.value}
            unit={data.unit}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsSummaryCard;
