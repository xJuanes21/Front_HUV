// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse, authService } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay token al cargar la app
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken && !authService.isTokenExpired(savedToken)) {
      setToken(savedToken);
      // Obtener información del usuario
      authService.getCurrentUser(savedToken)
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('auth_token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      localStorage.removeItem('auth_token');
      setIsLoading(false);
    }
  }, []);

  const login = async (correo: string, password: string) => {
    setIsLoading(true);
    try {
      const authData: AuthResponse = await authService.login(correo, password);
      setUser(authData.user);
      setToken(authData.access_token);
      localStorage.setItem('auth_token', authData.access_token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (token) {
      await authService.logout(token);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const hasRole = (role: string): boolean => {
    return user?.rol === role;
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}