import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { getStoredToken, setStoredToken, removeStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, confirmPassword?: string) => Promise<User>;
  logout: () => void;
  updateUserContext: (updatedUser: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        removeStoredToken();
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      // Invalid or expired token
      removeStoredToken();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await authService.login({ email, password });
    setStoredToken(response.token);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword?: string
  ): Promise<User> => {
    const response = await authService.register({
      name,
      email,
      password,
      confirmPassword,
    });
    setStoredToken(response.token);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
    setToken(null);
  };

  const updateUserContext = (updatedFields: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedFields });
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUserContext,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
