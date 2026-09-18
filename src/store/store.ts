import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserRoleStore {
  userRole: string;
  setUserRole: (role: string) => void;
  userId: number;
  setUserId: (id: number) => void;
}

export const useRoleStore = create<UserRoleStore>()(
  persist(
    (set) => ({
      userRole: "",
      setUserRole: (role) => set({ userRole: role }),
      userId: 0,
      setUserId: (id) => set({ userId: id }),
    }),
    { name: "user-role" }
  )
);
