// src/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface AuthState {
  userId: string;
  userType: string;
  userEmail: string;
  token: string | null;
  hasHydrated: boolean;
  setHasHydrated: (state: string) => void;
  setUserId: (state: string) => void;
  setUserEmail: (state: string) => void;
  setToken: (state: string) => void;
  setUserType: (state: string) => void;
}

const useAuthStore = create<
  AuthState,
  [["zustand/persist", AuthState], ["zustand/devtools", never]]
>(
  persist(
    (set) => ({
      userId: "",
      userType: "",
      userEmail: "",
      token: null,
      hasHydrated: false,
      setHasHydrated: (state: any) => {
        set({
          hasHydrated: state,
        });
      },
      setUserId: (userId: string) => set(() => ({ userId })),
      setUserEmail: (userEmail: string) => set(() => ({ userEmail })),
      setToken: (token: string) => set(() => ({ token })),
      setUserType: (userType: string) => set(() => ({ userType })),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state: any) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuthStore;
