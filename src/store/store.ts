import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserRoleStore {
  userRole: string;
  setUserRole: (role: string) => void;
}

export const useRoleStore = create<UserRoleStore>()(
  persist(
    (set) => ({
      userRole: "",
      setUserRole: (role) => set({ userRole: role }),
    }),
    { name: "user-role" }
  )
);
