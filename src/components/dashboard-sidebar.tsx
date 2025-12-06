'use client';

import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import type { DashboardSidebarProps } from '@/types/types';
import {
  BarChart3,
  Bot,
  CreditCard,
  DollarSign,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/members', label: 'Members', icon: Users, requiresMess: true },
  { href: '/dashboard/meals', label: 'Meals', icon: UtensilsCrossed, requiresMess: true },
  { href: '/dashboard/expenses', label: 'Expenses', icon: DollarSign, requiresMess: true },
  { href: '/dashboard/deposits', label: 'Deposits', icon: Wallet, requiresMess: true },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, requiresMess: true },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText, requiresMess: true },
  {
    href: '/dashboard/subscriptions',
    label: 'Subscriptions',
    icon: CreditCard,
    requiresMess: true,
  },
  { href: '/dashboard/ai', label: 'AI Assistant', icon: Bot, requiresMess: true },
  { href: '/dashboard/profile', label: 'Profile', icon: Settings },
];

export default function DashboardSidebar({ isOpen }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [hasMess, setHasMess] = useState(false);

  useEffect(() => {
    const checkUserMess = async () => {
      try {
        const profileRes = await apiClient.get<{ id: string; messId?: string }>('/users/profile');
        if (profileRes.data?.messId) {
          setHasMess(true);
        }
      } catch (err) {
        // User not authenticated or error, keep hasMess as false
      }
    };

    checkUserMess();
  }, []);

  return (
    <aside
      className={`fixed top-16 left-0 z-30 w-64 glass-sidebar border-r border-white/10 dark:border-white/5 transform transition-transform md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      role="complementary"
      aria-label="Main navigation"
    >
      <nav className="p-6 space-y-4 mt-16 md:mt-0" role="navigation" aria-label="Dashboard menu">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground px-2" id="menu-heading">
            Menu
          </h2>
          <ul role="menu" aria-labelledby="menu-heading">
            {menuItems
              .filter((item) => !item.requiresMess || hasMess)
              .map((item) => {
                const Icon = item.icon;
                // Check if current path matches this menu item
                // Exact match, or direct child (but not grandchild)
                const pathParts = pathname.split('/').filter(Boolean);
                const hrefParts = item.href.split('/').filter(Boolean);
                const isActive = pathname === item.href;
                return (
                  <li key={item.href} role="menuitem">
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className={`w-full justify-start gap-2 ${
                          isActive ? 'glass-glow' : 'hover:glass-light'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        {item.label}
                      </Button>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
