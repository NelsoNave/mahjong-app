import { create } from "zustand";
import { GameStats } from "@/types/game";

interface StatsStore {
  isMonthlyView: boolean;
  isFourPlayers: boolean;
  gameStats: GameStats | null;
  targetDate: string;
  setMonthView: () => void;
  setOverallView: () => void;
  setIsFourPlayers: () => void;
  setIsThreePlayers: () => void;
  setGameStats: (gameStats: GameStats) => void;
  setTargetDate: (targetDate: string) => void;
}

export const useStatsStore = create<StatsStore>()((set) => ({
  isMonthlyView: true,
  isFourPlayers: true,
  gameStats: null,
  targetDate: "2024-12",
  setMonthView: () => set({ isMonthlyView: true }),
  setOverallView: () => set({ isMonthlyView: false }),
  setIsFourPlayers: () => set({ isFourPlayers: true }),
  setIsThreePlayers: () => set({ isFourPlayers: false }),
  setGameStats: (newStats: GameStats) =>
    set((state) => ({ ...state, gameStats: newStats })),
  setTargetDate: (newDate: string) =>
    set((state) => ({ ...state, targetDate: newDate })),
}));
