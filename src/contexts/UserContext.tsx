import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string | null;
  role: string;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (newData: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({
    firstName: 'Abdelrahman',
    lastName: 'Ghareeb',
    email: 'admin@sportsclub.com',
    phone: '+1 (555) 123-4567',
    profileImage: null,
    role: 'Administrator'
  });

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};
