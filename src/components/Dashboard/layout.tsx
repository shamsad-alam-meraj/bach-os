'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  mess: any;
  themeClass?: string;
}

export default function DashboardLayout({ children, mess, themeClass }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-background ${themeClass || ''} ${themeClass ? 'page-themed' : ''}`}>
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex">
        {mess && <DashboardSidebar isOpen={sidebarOpen} />}
        <main className={`flex-1 p-4 md:p-6 ${mess ? 'md:ml-64' : ''}`}>{children}</main>
      </div>
    </div>
  );
}
