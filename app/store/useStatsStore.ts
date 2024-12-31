import { create } from "zustand";

interface StatsStore {
  isMonthlyView: boolean;
  setMonthView: () => void;
  setOverallView: () => void;
}

export const useStatsStore = create<StatsStore>()((set) => ({
  isMonthlyView: true,
  setMonthView: () => set({ isMonthlyView: true }),
  setOverallView: () => set({ isMonthlyView: false }),
}));
