import { create } from "zustand";
import { GameStats } from "@/types/game";

interface StatsStore {
  isMonthlyView: boolean;
  isFourPlayers: boolean;
  gameStats: GameStats | null;
  selectedMonth: string;
  targetDate: string;
  setMonthView: () => void;
  setOverallView: () => void;
  setIsFourPlayers: () => void;
  setIsThreePlayers: () => void;
  setGameStats: (gameStats: GameStats) => void;
  setSelectedMonth: (newDate: string) => void;
  setTargetDate: (targetDate: string) => void;
}

export const useStatsStore = create<StatsStore>()((set) => ({
  isMonthlyView: true,
  isFourPlayers: true,
  gameStats: null,
  selectedMonth: "",
  targetDate: "",
  setMonthView: () => set({ isMonthlyView: true }),
  setOverallView: () => set({ isMonthlyView: false }),
  setIsFourPlayers: () => set({ isFourPlayers: true }), // 後で一つにまとめる
  setIsThreePlayers: () => set({ isFourPlayers: false }),
  setGameStats: (newStats: GameStats) =>
    set((state) => ({ ...state, gameStats: newStats })),
  setSelectedMonth: (newDate: string) =>
    set((state) => ({ ...state, selectedMonth: newDate })),
  setTargetDate: (newDate: string) =>
    set((state) => ({ ...state, targetDate: newDate })),
}));
