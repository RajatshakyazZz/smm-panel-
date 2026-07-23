'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Users,
  RefreshCw,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { User } from '@/lib/types';

const revenueData = [
  { day: 'Mon', revenue: 4200, profit: 1470 },
  { day: 'Tue', revenue: 6800, profit: 2380 },
  { day: 'Wed', revenue: 9500, profit: 3325 },
  { day: 'Thu', revenue: 12400, profit: 4340 },
  { day: 'Fri', revenue: 15800, profit: 5530 },
  { day: 'Sat', revenue: 21000, profit: 7350 },
  { day: 'Sun', revenue: 28500, profit: 9975 },
];

export default function AdminOverviewPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const fetchOverview = () => {
    fetch('/api/admin?action=overview')
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) setMetrics(data.metrics);
        if (data.priceAlerts) setAlerts(data.priceAlerts);
      });
  };

  useEffect(() => {
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username: 'admin' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setAdminUser(data.user);
      });

    fetchOverview();
  }, []);

  const handleSyncFameProvider = async () => {
    setSyncing(true);
    setSyncMsg('');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_fameprovider' }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncMsg(`Synced ${data.syncedCount} services from FameProvider! Created ${data.alertsCreated} price alerts.`);
        fetchOverview();
      }
    } catch (err) {
      setSyncMsg('Sync error occurred.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar
        user={adminUser}
        onLogout={() => (window.location.href = '/login')}
      />

      <div className="flex flex-1">
        <DashboardSidebar role="super_admin" isAdminNav={true} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                  SUPER ADMIN
                </span>
                <h1 className="text-2xl font-black text-white">FameProvider Executive Dashboard</h1>
              </div>
              <p className="mt-1 text-xs text-slate-400">Main SMM Supplier Analytics & Real-time FameProvider API Bridge</p>
            </div>

            <button
              onClick={handleSyncFameProvider}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing FameProvider...' : 'Sync Services Now'}</span>
            </button>
          </div>

          {syncMsg && (
            <div className="mb-6 rounded-xl bg-purple-500/10 border border-purple-500/20 p-3.5 text-xs text-purple-300 font-semibold">
              {syncMsg}
            </div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Revenue (\u20B9)</span>
              <div className="mt-2 text-2xl font-black text-white font-mono">
                \u20B9{metrics ? metrics.totalRevenueINR.toFixed(2) : '0.00'}
              </div>
              <span className="mt-1 block text-[11px] text-emerald-400 font-medium">● Indian Gateway Deposits</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Net Profit (\u20B9)</span>
              <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">
                \u20B9{metrics ? metrics.totalNetProfitINR.toFixed(2) : '0.00'}
              </div>
              <span className="mt-1 block text-[11px] text-slate-400">35% Avg Selling Margin</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Provider Balance ($)</span>
              <div className="mt-2 text-2xl font-black text-blue-400 font-mono">
                {metrics ? metrics.providerBalanceUSD : '$0.00'}
              </div>
              <span className="mt-1 block text-[11px] text-blue-300 font-medium">FameProvider USD Reserve</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Price Alerts</span>
              <div className="mt-2 text-2xl font-black text-amber-400 font-mono">
                {metrics ? metrics.unresolvedAlertsCount : 0}
              </div>
              <Link href="/admin/alerts" className="mt-1 block text-[11px] text-amber-400 hover:underline">
                Review Rate Hikes →
              </Link>
            </div>

          </div>

          {/* Revenue & Profit Analytics Chart */}
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-white">Revenue vs Net Profit (\u20B9)</h2>
                <p className="text-xs text-slate-400">Weekly financial performance curve in Indian Rupees</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="h-3 w-3 rounded-full bg-blue-500" /> Revenue (\u20B9)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" /> Net Profit (\u20B9)
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" textAnchor="end" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProf)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/services"
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-purple-500/40 hover:bg-slate-900 transition-all"
            >
              <RefreshCw className="h-8 w-8 text-purple-400 mb-3" />
              <h3 className="text-base font-bold text-white">Price Management & Exchange Rate</h3>
              <p className="mt-1 text-xs text-slate-400">Configure USD to INR rate, set margins & lock prices.</p>
            </Link>

            <Link
              href="/admin/alerts"
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-amber-500/40 hover:bg-slate-900 transition-all"
            >
              <Bell className="h-8 w-8 text-amber-400 mb-3" />
              <h3 className="text-base font-bold text-white">Provider Rate Change Alerts</h3>
              <p className="mt-1 text-xs text-slate-400">Review provider rate increases or decreases automatically.</p>
            </Link>

            <Link
              href="/admin/gateways"
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-500/40 hover:bg-slate-900 transition-all"
            >
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-3" />
              <h3 className="text-base font-bold text-white">Indian Payment Gateways</h3>
              <p className="mt-1 text-xs text-slate-400">PhonePe, Paytm, Razorpay, Cashfree merchant keys.</p>
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}
