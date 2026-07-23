'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  ListPlus,
  Grid,
  History,
  Wallet,
  LifeBuoy,
  Users,
  Code2,
  ShieldCheck,
  Bell,
  Settings,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface DashboardSidebarProps {
  role?: UserRole;
  isAdminNav?: boolean;
}

export default function DashboardSidebar({ role = 'customer', isAdminNav = false }: DashboardSidebarProps) {
  const pathname = usePathname();

  const userMenuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'New Order', href: '/dashboard/new-order', icon: ShoppingCart },
    { label: 'Mass Order', href: '/dashboard/mass-order', icon: ListPlus },
    { label: 'Services', href: '/dashboard/services', icon: Grid },
    { label: 'Order History', href: '/dashboard/orders', icon: History },
    { label: 'Add Funds (\u20B9)', href: '/dashboard/wallet', icon: Wallet },
    { label: 'Support Tickets', href: '/dashboard/tickets', icon: LifeBuoy },
    { label: 'Affiliate Program', href: '/dashboard/affiliate', icon: Users },
    { label: 'API Access', href: '/dashboard/api-docs', icon: Code2 },
  ];

  const adminMenuItems = [
    { label: 'Executive Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'FameProvider & Prices', href: '/admin/services', icon: RefreshCw },
    { label: 'Price Alerts', href: '/admin/alerts', icon: Bell },
    { label: 'Orders Manager', href: '/admin/orders', icon: History },
    { label: 'User Accounts', href: '/admin/users', icon: Users },
    { label: 'Indian Gateways', href: '/admin/gateways', icon: CreditCard },
    { label: 'Ticket Desk', href: '/admin/tickets', icon: LifeBuoy },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  const menu = isAdminNav ? adminMenuItems : userMenuItems;

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800/80 p-4 min-h-[calc(100vh-5rem)] hidden md:flex flex-col">
      
      {/* Navigation Type Title */}
      <div className="mb-4 px-3.5 py-2.5 flex items-center justify-between rounded-xl bg-slate-800/60 border border-slate-700/40">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          {isAdminNav ? 'Admin Console' : 'User Navigation'}
        </span>
        {role === 'super_admin' && (
          <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/30">
            PRO
          </span>
        )}
      </div>

      <nav className="space-y-1 flex-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Quick Wallet Widget matching Sleek Interface design */}
      {!isAdminNav && (
        <div className="mt-6 p-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Instant Add Funds</p>
          <p className="text-sm text-slate-300 font-medium mb-3">UPI / QR / NetBanking ready</p>
          <Link
            href="/dashboard/wallet"
            className="inline-block w-full text-center bg-slate-700 hover:bg-slate-600 text-white text-xs py-2 rounded-xl font-semibold transition-colors"
          >
            Deposit Funds (₹)
          </Link>
        </div>
      )}

      {/* Switcher Banner if Super Admin */}
      {role === 'super_admin' && (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-center">
          <span className="block text-[11px] text-slate-400 mb-2">Switch Panel Mode:</span>
          <Link
            href={isAdminNav ? '/dashboard' : '/admin'}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{isAdminNav ? 'Go to User View' : 'Go to Admin View'}</span>
          </Link>
        </div>
      )}

    </aside>
  );
}
