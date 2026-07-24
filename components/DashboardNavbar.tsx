'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Wallet, Plus, ShieldCheck, LogOut, Sparkles, Menu, X, LayoutDashboard, ShoppingCart, ListPlus, Grid, History, LifeBuoy, Users, Code2, Bell, CreditCard, Settings, RefreshCw } from 'lucide-react';
import { User } from '@/lib/types';

interface DashboardNavbarProps {
  user: User | null;
  onOpenDepositModal?: () => void;
  onLogout?: () => void;
}

export default function DashboardNavbar({ user, onOpenDepositModal, onLogout }: DashboardNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminNav = pathname.startsWith('/admin');

  const userMenuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'New Order', href: '/dashboard/new-order', icon: ShoppingCart },
    { label: 'Mass Order', href: '/dashboard/mass-order', icon: ListPlus },
    { label: 'Services', href: '/dashboard/services', icon: Grid },
    { label: 'Order History', href: '/dashboard/orders', icon: History },
    { label: 'Add Funds (₹)', href: '/dashboard/wallet', icon: Wallet },
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
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md shadow-lg shadow-black/20">
      
      {/* Brand Logo & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex md:hidden items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href={user?.role === 'super_admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white hidden sm:inline">
            FAME<span className="text-blue-500">PROVIDER</span>
          </span>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        
        {/* Server Status Indicator */}
        <div className="hidden lg:flex flex-col items-end mr-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Server Status</span>
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> Direct API Active
          </span>
        </div>

        {/* Wallet Balance Badge */}
        {user && (
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-1 pl-3 shadow-inner">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider hidden xs:inline">Bal:</span>
              <span className="text-emerald-400 font-mono text-xs sm:text-sm font-extrabold">₹{user.balanceINR.toFixed(2)}</span>
            </div>

            <button
              onClick={onOpenDepositModal}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition-colors"
              title="Add Funds in ₹"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        )}

        {/* View Switcher for Super Admin */}
        {user?.role === 'super_admin' && (
          <button
            onClick={() => {
              if (pathname.startsWith('/admin')) {
                router.push('/dashboard');
              } else {
                router.push('/admin');
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
            <span>{pathname.startsWith('/admin') ? 'User Panel' : 'Admin Panel'}</span>
          </button>
        )}

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-2.5 border-l border-slate-800/80 pl-3 sm:pl-4">
            <div className="hidden md:block text-right">
              <span className="block text-xs font-bold text-white">{user.username}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {user.role === 'super_admin' ? 'Super Admin' : 'Customer'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-slate-950 border-b border-slate-800 p-4 shadow-2xl md:hidden z-50">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-bold text-slate-300">
            <span>Logged in as: <strong className="text-white">{user?.username}</strong></span>
            {user?.role === 'super_admin' && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push(pathname.startsWith('/admin') ? '/dashboard' : '/admin');
                }}
                className="text-purple-400 underline font-semibold"
              >
                Switch to {pathname.startsWith('/admin') ? 'User' : 'Admin'}
              </button>
            )}
          </div>
          <nav className="grid grid-cols-2 gap-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
