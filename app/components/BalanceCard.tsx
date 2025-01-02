import React from "react";
import { GameStats } from "@/types/game";
import { useStatsStore } from "@/store/useStatsStore";

type BalanceCardProps = {
  gameStats: GameStats | null;
};

const FinancialStatItem = ({
  label,
  value,
  isNegative = false,
}: {
  label: string;
  value: number;
  isNegative?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <p className="text-sm">{label}</p>
    <p className="flex items-center gap-1">
      <span className={isNegative ? "text-appleBlossom" : "text-denim"}>
        {isNegative
          ? `-${value.toLocaleString()}`
          : `+${value.toLocaleString()}`}
      </span>
      <span className="text-sm">P</span>
    </p>
  </div>
);

const BalanceCard = ({ gameStats }: BalanceCardProps) => {
  const { isFourPlayers } = useStatsStore();

  if (!gameStats) {
    return (
      <div className="flex flex-col gap-2">
        <p>データが存在しません</p>
      </div>
    );
  }

  const getFinancialStat = () => {
    return isFourPlayers
      ? gameStats.fourPlayerGameStats?.financialStats
      : gameStats.threePlayerGameStats?.financialStats;
  };

  const dailyStats = getFinancialStat() || {};

  const { totalIncome = 0, totalExpense = 0, totalProfit = 0 } = dailyStats;

  return (
    <div className="flex flex-col gap-2">
      <FinancialStatItem label="収入" value={totalIncome} />
      <FinancialStatItem label="支出" value={totalExpense} isNegative />
      <p className="border-b border-black"></p>
      <FinancialStatItem label="総合" value={totalProfit} />
    </div>
  );
};

export default BalanceCard;
