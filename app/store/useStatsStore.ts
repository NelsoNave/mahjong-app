import { create } from "zustand";
import { GameStats } from "@/types/game";

interface StatsStore {
  isMonthlyView: boolean;
  isFourPlayers: boolean;
  gameStats: GameStats | null;
  targetDate: string;
  availableDate: string[];
  setMonthView: () => void;
  setOverallView: () => void;
  setIsFourPlayers: () => void;
  setIsThreePlayers: () => void;
  setGameStats: (gameStats: GameStats) => void;
  setTargetDate: (targetDate: string) => void;
  setAvailableDate: (newDates: string[]) => void;
  setDisplayDate: () => void;
}

export const useStatsStore = create<StatsStore>()((set) => ({
  isMonthlyView: true,
  isFourPlayers: true,
  gameStats: null,
  targetDate: "",
  availableDate: [],
  setMonthView: () => set({ isMonthlyView: true }),
  setOverallView: () => set({ isMonthlyView: false }),
  setIsFourPlayers: () => set({ isFourPlayers: true }),
  setIsThreePlayers: () => set({ isFourPlayers: false }),
  setGameStats: (newStats: GameStats) =>
    set((state) => ({ ...state, gameStats: newStats })),
  setTargetDate: (newDate: string) =>
    set((state) => ({ ...state, targetDate: newDate })),
  setAvailableDate: (newDates: string[]) =>
    set((state) => ({
      ...state,
      availableDate: [...state.availableDate, ...newDates],
    })),
  setDisplayDate: () =>
    set((state) => {
      if (!state.availableDate || state.availableDate.length === 0) {
        return state;
      }

      const updatedAvailableDate = [
        ...state.availableDate.slice(1),
        state.availableDate[0],
      ];

      return { availableDate: updatedAvailableDate };
    }),
}));
