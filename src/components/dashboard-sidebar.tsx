'use client';

import { Button } from '@/components/ui/button';
import {
  BarChart3,
  DollarSign,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardSidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/members', label: 'Members', icon: Users },
  { href: '/dashboard/meals', label: 'Meals', icon: UtensilsCrossed },
  { href: '/dashboard/expenses', label: 'Expenses', icon: DollarSign },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/profile', label: 'Profile', icon: Settings },
];

export default function DashboardSidebar({ isOpen }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-30 w-64 glass-sidebar md:glass-light border-r border-white/10 dark:border-white/5 transform transition-transform md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <nav className="p-6 space-y-4 mt-16 md:mt-0">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground px-2">Menu</h2>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-2 ${
                    isActive ? 'glass-glow' : 'hover:glass-light'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
