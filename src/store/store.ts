import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserRoleStore {
  userDetails: {
    username: string;
    email: string;
    userRole: string;
    userId: number;
  };
  setUserDetails: (details: {
    username: string;
    email: string;
    userRole: string;
    userId: number;
  }) => void;
};

export const useRoleStore = create<UserRoleStore>()(
  persist(
    (set) => ({
      userDetails: {
        username: "",
        email: "",
        userRole: "",
        userId: 0
      },
      setUserDetails: (details) => set({ userDetails: details })
    }),
    { name: "user-role" }
  )
);
