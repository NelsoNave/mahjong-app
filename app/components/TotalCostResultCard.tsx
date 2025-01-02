import React from "react";
import { GameStats } from "@/types/game";
import { useStatsStore } from "@/store/useStatsStore";

type TotalCostCardProps = {
  gameStats: GameStats | null;
};

const TotalCostResultCard = ({ gameStats }: TotalCostCardProps) => {
  const { isFourPlayers } = useStatsStore();

  const getFinancialStat = () => {
    if (!gameStats) {
      return null;
    }
    return isFourPlayers
      ? gameStats.fourPlayerGameStats?.financialStats
      : gameStats.threePlayerGameStats?.financialStats;
  };

  const dailyStats = getFinancialStat();

  const getValidValue = (value: number | undefined): string => {
    if (value === undefined || isNaN(value)) {
      return "0";
    }
    return value === 0 ? "0" : value.toLocaleString();
  };

  return (
    <div className="flex flex-col gap-2">
      {/* gameFee */}
      <div className="flex items-center justify-between">
        <p className="text-sm">ゲーム代</p>
        <p className="flex items-center gap-1">
          <span className="text-denim">
            {getValidValue(dailyStats?.gameFee)}
          </span>
          <span className="text-sm">P</span>
        </p>
      </div>
      {/* totalProfitProfit(include gameFee) */}
      <div className="flex items-center justify-between">
        <p className="text-sm">ゲーム代込</p>
        <p className="flex items-center gap-1">
          <span className="text-denim">
            {getValidValue(dailyStats?.totalProfitIncludingGameFee)}
          </span>
          <span className="text-sm">P</span>
        </p>
      </div>
    </div>
  );
};

export default TotalCostResultCard;
