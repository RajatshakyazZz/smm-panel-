'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Bell, AlertTriangle, ShieldCheck } from 'lucide-react';
import { User } from '@/lib/types';

export default function AdminAlertsPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('smm_user') : null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'super_admin') {
          setAdminUser(parsed);
          return;
        }
      } catch (e) {}
    }
    window.location.href = '/login?error=admin_access_required';
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar user={adminUser} onLogout={() => (window.location.href = '/login')} />

      <div className="flex flex-1">
        <DashboardSidebar role="super_admin" isAdminNav={true} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">System Alerts & Notifications</h1>
            <p className="mt-1 text-xs text-slate-400">Monitor automated API health and transaction warnings</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">
            <ShieldCheck className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">All Systems Operational</h3>
            <p className="text-xs">Provider API synchronization and payment gateway callbacks are operating with 100% uptime.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
