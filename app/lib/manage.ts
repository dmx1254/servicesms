import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MyStore {
  solde: number;
  addSolde: (sold: number) => void;
}

const useStore = create<MyStore>()(
  persist(
    (set) => ({
      solde: 0,
      addSolde: (sold: number) => set({ solde: sold }),
    }),

    {
      name: "servicesms-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStore;
