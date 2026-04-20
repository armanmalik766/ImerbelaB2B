import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSellerProfile, getToken, removeToken, removeStoredRole, setToken, setStoredRole, SellerProfile } from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  isPending: boolean;
  isRejected: boolean;
  seller: SellerProfile | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, role: string) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isApproved: false,
    isAdmin: false,
    isPending: false,
    isRejected: false,
    seller: null,
    isLoading: true,
  });

  const fetchProfile = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setState({
        isAuthenticated: false,
        isApproved: false,
        isAdmin: false,
        isPending: false,
        isRejected: false,
        seller: null,
        isLoading: false,
      });
      return;
    }

    try {
      const response = await getSellerProfile();
      if (response.success && response.data) {
        const seller = response.data;
        setState({
          isAuthenticated: true,
          isApproved: seller.status === 'approved',
          isAdmin: seller.role === 'admin',
          isPending: seller.status === 'pending',
          isRejected: seller.status === 'rejected',
          seller,
          isLoading: false,
        });
      }
    } catch {
      // Invalid/expired token
      removeToken();
      removeStoredRole();
      setState({
        isAuthenticated: false,
        isApproved: false,
        isAdmin: false,
        isPending: false,
        isRejected: false,
        seller: null,
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = (token: string, role: string) => {
    setToken(token);
    setStoredRole(role);
    fetchProfile();
  };

  const logoutFn = () => {
    removeToken();
    removeStoredRole();
    setState({
      isAuthenticated: false,
      isApproved: false,
      isAdmin: false,
      isPending: false,
      isRejected: false,
      seller: null,
      isLoading: false,
    });
    // Force redirect and clean state
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout: logoutFn,
        refreshProfile: fetchProfile,
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
