"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, Store, InitialData } from '@/types/user';

interface UserContextType {
  user: UserProfile | null;
  store: Store | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setStore: (store: Store | null) => void;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ 
  children,
  initialData 
}: { 
  children: ReactNode;
  initialData?: InitialData;
}) {
  const [user, setUser] = useState<UserProfile | null>(initialData?.user ?? null);
  const [store, setStore] = useState<Store | null>(() => {
    if (!initialData?.store) return null;
    const { trialEndsAt, createdAt, updatedAt, ...rest } = initialData.store;
    return {
      ...rest,
      trialEndsAt: trialEndsAt ? new Date(trialEndsAt) : null,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
    };
  });
  const [loading, setLoading] = useState(false);

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await response.json();
        setUser({ ...user, ...updates });
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        store,
        loading,
        setUser,
        setStore,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}