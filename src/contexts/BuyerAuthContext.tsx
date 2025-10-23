'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Buyer } from '@/types/buyer';

interface BuyerAuthContextType {
  buyer: Buyer | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateBuyer: (updates: Partial<Buyer>) => Promise<void>;
}

const BuyerAuthContext = createContext<BuyerAuthContextType | undefined>(undefined);

export function BuyerAuthProvider({ children }: { children: ReactNode }) {
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if buyer is already logged in (from localStorage or session)
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check localStorage for buyer session
      const storedBuyer = localStorage.getItem('buyer');
      if (storedBuyer) {
        const buyerData = JSON.parse(storedBuyer);
        setBuyer(buyerData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/buyer/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setBuyer(data.buyer);
        localStorage.setItem('buyer', JSON.stringify(data.buyer));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const signup = async (email: string, password: string, name: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/buyer/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setBuyer(data.buyer);
        localStorage.setItem('buyer', JSON.stringify(data.buyer));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/buyer/auth/logout', { method: 'POST' });
      setBuyer(null);
      localStorage.removeItem('buyer');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateBuyer = async (updates: Partial<Buyer>) => {
    if (!buyer) return;

    try {
      const response = await fetch('/api/buyer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedBuyer = { ...buyer, ...updates };
        setBuyer(updatedBuyer);
        localStorage.setItem('buyer', JSON.stringify(updatedBuyer));
      }
    } catch (error) {
      console.error('Error updating buyer:', error);
    }
  };

  return (
    <BuyerAuthContext.Provider
      value={{
        buyer,
        loading,
        isAuthenticated: !!buyer,
        login,
        signup,
        logout,
        updateBuyer,
      }}
    >
      {children}
    </BuyerAuthContext.Provider>
  );
}

export function useBuyerAuth() {
  const context = useContext(BuyerAuthContext);
  if (context === undefined) {
    throw new Error('useBuyerAuth must be used within a BuyerAuthProvider');
  }
  return context;
}
