import { GameType, NumberOfPlayers } from "@prisma/client";


export type GameInfo = {
  id: number;
  gameType: GameType;
  numberOfPlayers: NumberOfPlayers;
  playedAt: Date;
  rate: number;
  chipRate: number;
  fee: number;
  createdBy: {
    userId: number;
    name: string;
  };
  chipResults: {
    userId: number | null;
    name: string;
    chipChange: number;
  }[];
  rounds: {
    id: number;
    roundNumber: number;
    results: {
      userId: number;
      name: string;
      scoreChange: number;
      rank: number;
      position: number;
    }[];
  }[];
};


export type GameStats = {
  threePlayerGameStats: {
    // 1-4着, 回数, 割合
    rankStats: {
     "1": {
        count: number;
        percentage: number;
     } ,
     "2": {
        count: number;
        percentage: number;
     } ,
     "3": {
        count: number;
        percentage: number;
     }
     "4": {
        count: number;
        percentage: number;
     }
    };
    performanceStats: {
        winRate: number;
        averageRank: number;
        totalChips: number;
        totalScore: number;
    };
    financialStats: {
        totalIncome: number;
        totalExpense: number;
        totalProfit: number;
        gameFee: number;
        totalProfitIncludingGameFee: number;
    };
    dailyStats: {
        date: Date;
        income: number;
        expense: number;
    }[];
  };
  fourPlayerGameStats: {
    // 1-4着, 回数, 割合
    rankStats: {
     "1": {
        count: number;
        percentage: number;
     } ,
     "2": {
        count: number;
        percentage: number;
     } ,
     "3": {
        count: number;
        percentage: number;
     }
     "4": {
        count: number;
        percentage: number;
     }
    };
    performanceStats: {
        winRate: number;
        averageRank: number;
        totalChips: number;
        totalScore: number;
    };
    financialStats: {
        totalIncome: number;
        totalExpense: number;
        totalProfit: number;
        gameFee: number;
        totalProfitIncludingGameFee: number;
    };
    dailyStats: {
        date: Date;
        income: number;
        expense: number;
    }[];
  };
};