'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wallet, Plus, ShieldCheck, LogOut, User as UserIcon, Sparkles, Bell } from 'lucide-react';
import { User } from '@/lib/types';

interface DashboardNavbarProps {
  user: User | null;
  onOpenDepositModal?: () => void;
  onLogout?: () => void;
}

export default function DashboardNavbar({ user, onOpenDepositModal, onLogout }: DashboardNavbarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md sm:px-8 shadow-xs">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link href={user?.role === 'super_admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:inline">
            FAME<span className="text-blue-600">PROVIDER</span>
          </span>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Server Status Indicator */}
        <div className="hidden lg:flex flex-col items-end mr-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Server Status</span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> High Speed
          </span>
        </div>

        {/* Wallet Balance Badge */}
        {user && (
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pl-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Balance:</span>
              <span className="text-emerald-600 font-mono text-sm font-bold">₹{user.balanceINR.toFixed(2)}</span>
            </div>

            <button
              onClick={onOpenDepositModal}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              title="Add Funds in ₹"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
        )}

        {/* View Switcher for Super Admin */}
        {user?.role === 'super_admin' && (
          <button
            onClick={() => {
              if (window.location.pathname.startsWith('/admin')) {
                router.push('/dashboard');
              } else {
                router.push('/admin');
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
            <span>{window.location.pathname.startsWith('/admin') ? 'User Panel' : 'Admin Panel'}</span>
          </button>
        )}

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="hidden md:block text-right">
              <span className="block text-xs font-bold text-slate-900">{user.username}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {user.role === 'super_admin' ? 'Super Admin' : 'Customer'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
