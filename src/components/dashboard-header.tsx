'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { LogOut, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { DashboardHeaderProps } from '@/types/types';

export default function DashboardHeader({ sidebarOpen, onToggleSidebar }: DashboardHeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header
      className="glass-header border-b border-white/10 dark:border-white/5"
      role="banner"
    >
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
          bachOS
        </h1>
        <nav className="flex items-center gap-4" role="navigation" aria-label="User actions">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden hover:glass-light"
            aria-label={sidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 glass-light hover:glass border-white/20 dark:border-white/10 bg-transparent"
            aria-label="Log out of your account"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
