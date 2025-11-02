'use client';

import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function DashboardHeader({ sidebarOpen, onToggleSidebar }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <header className="glass-header border-b border-white/10 dark:border-white/5">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
          bachOS
        </h1>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden hover:glass-light"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 glass-light hover:glass border-white/20 dark:border-white/10 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
