// src/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface ConfigState {
  hasHydrated: boolean;
  configs: any;
  timezones: any;
  states: any;
  selectedCountry: any;
  isConfigLoading: any;
  setSelectedCountry: (state: string) => void;
  setStates: (state: string) => void;
  setHasHydrated: (state: string) => void;
  setConfigs: (state: string) => void;
  setTimeZones: (state: string) => void;
  setIsconfigLoading: (state: boolean) => void;
}

const useConfigStore = create<
  ConfigState,
  [["zustand/persist", ConfigState], ["zustand/devtools", never]]
>(
  persist(
    (set) => ({
      configs: null,
      timezones: null,
      states: null,
      selectedCountry: null,
      isConfigLoading: false,
      setHasHydrated: (state: any) => {
        set({
          hasHydrated: state,
        });
      },
      setConfigs: (configs: any) => set(() => ({ configs })),
      setSelectedCountry: (selectedCountry: any) =>
        set(() => ({ selectedCountry })),
      setTimeZones: (timezones: any) => set(() => ({ timezones })),
      setStates: (states: any) => set(() => ({ states })),
      setIsconfigLoading: (isConfigLoading: any) =>
        set(() => ({ isConfigLoading })),
    }),
    {
      name: "config-storage",
      onRehydrateStorage: () => (state: any) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useConfigStore;
