"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import CookieConsent from '../CookieConsent';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { UserProvider } from '@/contexts/UserContext';

import { InitialData } from '@/types/user';

interface DashboardLayoutProps {
  children: ReactNode;
  initialData?: InitialData;
}

const DashboardLayout = ({ children, initialData }: DashboardLayoutProps) => {
  return (
    <UserProvider initialData={initialData}>
      <DashboardProvider>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </div>
            </main>
          </div>
        </div>
        <CookieConsent />
      </DashboardProvider>
    </UserProvider>
  );
};

export default DashboardLayout;