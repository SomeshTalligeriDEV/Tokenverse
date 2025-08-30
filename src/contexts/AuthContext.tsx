import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';

interface User {
  id: string;
  wallet: string;
  role: 'user' | 'brand';
  name: string;
  points: number;
  tokensEarned: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: 'user' | 'brand', name: string) => Promise<void>;
  logout: () => void;
  updateUserPoints: (points: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { account, isConnected } = useWallet();

  const login = async (role: 'user' | 'brand', name: string) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }

    // Simulate Firebase auth
    const newUser: User = {
      id: `${role}_${Date.now()}`,
      wallet: account,
      role,
      name,
      points: role === 'user' ? 150 : 0, // Give users some initial points
      tokensEarned: role === 'user' ? 25 : 0,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserPoints = (points: number) => {
    if (user) {
      setUser({ ...user, points: user.points + points });
    }
  };

  // Auto-logout if wallet disconnects
  useEffect(() => {
    if (!isConnected && isAuthenticated) {
      logout();
    }
    setIsLoading(false);
  }, [isConnected, isAuthenticated]);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUserPoints,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};