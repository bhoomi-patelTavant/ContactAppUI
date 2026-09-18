import React, { createContext, useContext, useState } from 'react';

export const UserRoleContext = createContext<{ userRole: string; setUserRole: React.Dispatch<React.SetStateAction<string>>, userId: number; setUserId: React.Dispatch<React.SetStateAction<number>> }>({
  userRole: "",
  setUserRole: () => { },
  userId: 0,
  setUserId: () => { },
});

export const UserRoleProvider = ({ children }: { children?: React.ReactNode }) => {
  // This can be dynamically set based on your application logic
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(0);
  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole, userId, setUserId }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRoleContext = () => {
  const context = useContext(UserRoleContext);

  if (!context) {
    throw new Error("useUserRoleContext must be used inside UserRoleProvider");
  }

  return context;
}

