'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { History, RefreshCw, ExternalLink, CheckCircle2 } from 'lucide-react';
import { SMMOrder, User } from '@/lib/types';

export default function AdminOrdersPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<SMMOrder[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
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

    fetchOrders();
  }, []);

  const handleSyncOrders = async () => {
    setSyncing(true);
    setMsg('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });
      const data = await res.json();
      setMsg(`Synced ${data.updatedCount || 0} order statuses with FameProvider API.`);
      fetchOrders();
    } catch (err) {
      setMsg('Sync error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar user={adminUser} onLogout={() => (window.location.href = '/login')} />

      <div className="flex flex-1">
        <DashboardSidebar role="super_admin" isAdminNav={true} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white">System Orders Management</h1>
              <p className="mt-1 text-xs text-slate-400">Monitor all customer orders and provider cost vs profit calculations</p>
            </div>

            <button
              onClick={handleSyncOrders}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>Sync All Statuses</span>
            </button>
          </div>

          {msg && <div className="mb-4 text-xs font-bold text-emerald-400">{msg}</div>}

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Order Ref</th>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Provider ID</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">User Charge (\u20B9)</th>
                    <th className="py-3.5 px-4">Provider Cost (\u20B9)</th>
                    <th className="py-3.5 px-4">Net Profit (\u20B9)</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-300">#{ord.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{ord.username}</td>
                      <td className="py-3.5 px-4 font-mono text-purple-400">#{ord.providerOrderId || 'N/A'}</td>
                      <td className="py-3.5 px-4 max-w-xs truncate">{ord.serviceName}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">\u20B9{ord.chargeINR.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">\u20B9{ord.providerCostINR.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">+\u20B9{ord.profitINR.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-bold text-blue-400">{ord.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
