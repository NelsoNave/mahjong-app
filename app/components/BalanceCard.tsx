import React from "react";
import { GameStats } from "@/types/game";
import { useStatsStore } from "@/store/useStatsStore";

type BalanceCardProps = {
  gameStats: GameStats;
};

const BalanceCard = ({ gameStats }: BalanceCardProps) => {
  const { isFourPlayers } = useStatsStore();

  const getFinancialStat = () => {
    return isFourPlayers
      ? gameStats.fourPlayerGameStats?.financialStats
      : gameStats.threePlayerGameStats?.financialStats;
  };

  const dailyStats = getFinancialStat();

  const totalIncome = dailyStats?.totalIncome || 0;
  const totalExpense = dailyStats?.totalExpense || 0;
  const totalProfit = dailyStats?.totalProfit || 0;

  return (
    <div className="flex flex-col gap-2">
      {/* income */}
      <div className="flex items-center justify-between">
        <p className="text-sm">収入</p>
        <p className="flex items-center gap-1">
          <span className="text-denim">+{totalIncome}</span>
          <span className="text-sm">P</span>
        </p>
      </div>

      {/* expense */}
      <div className="flex items-center justify-between">
        <p className="text-sm">支出</p>
        <p className="flex items-center gap-1">
          <span className="text-appleBlossom">-{totalExpense}</span>
          <span className="text-sm">P</span>
        </p>
      </div>
      <p className="border-b border-black"></p>

      {/* total */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">総合</p>
        <p className="flex items-center gap-1">
          <span>{totalProfit}</span>
          <span className="text-sm">P</span>
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
