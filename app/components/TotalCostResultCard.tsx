import React from "react";
import { GameStats } from "@/types/game";
import { useStatsStore } from "@/store/useStatsStore";

type TotalCostCardProps = {
  gameStats: GameStats;
};

const TotalCostResultCard = ({ gameStats }: TotalCostCardProps) => {
  const { isFourPlayers } = useStatsStore();

  const getFinancialStat = () => {
    return isFourPlayers
      ? gameStats.fourPlayerGameStats?.financialStats
      : gameStats.threePlayerGameStats?.financialStats;
  };

  const dailyStats = getFinancialStat();

  return (
    <div className="flex flex-col gap-2">
      {/* gameFee */}
      <div className="flex items-center justify-between">
        <p className="text-sm">ゲーム代</p>
        <p className="flex items-center gap-1">
          <span className="text-denim">{dailyStats?.gameFee || 0}</span>
          <span className="text-sm">P</span>
        </p>
      </div>
      {/* totalProfitProfit(include gameFee) */}
      <div className="flex items-center justify-between">
        <p className="text-sm">ゲーム代込</p>
        <p className="flex items-center gap-1">
          <span className="text-denim">
            {dailyStats?.totalProfitIncludingGameFee || 0}
          </span>
          <span className="text-sm">P</span>
        </p>
      </div>
    </div>
  );
};

export default TotalCostResultCard;
