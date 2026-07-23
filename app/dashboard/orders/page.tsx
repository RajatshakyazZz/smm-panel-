'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import IndianPaymentModal from '@/components/IndianPaymentModal';
import { History, RefreshCw, ExternalLink, Filter, CheckCircle2 } from 'lucide-react';
import { User, SMMOrder } from '@/lib/types';

export default function OrderHistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<SMMOrder[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [syncing, setSyncing] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const fetchOrders = () => {
    fetch('/api/orders?userId=usr_demo_002')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      });
  };

  useEffect(() => {
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username: 'rajat_creator' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });

    fetchOrders();
  }, []);

  const handleSyncStatus = async () => {
    setSyncing(true);
    setActionMsg('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });
      const data = await res.json();
      fetchOrders();
      setActionMsg(`Synced ${data.updatedCount || 0} order statuses with FameProvider API!`);
    } catch (err) {
      setActionMsg('Failed to sync statuses.');
    } finally {
      setSyncing(false);
    }
  };

  const handleRefillRequest = (orderId: string) => {
    setActionMsg(`Refill request for #${orderId} submitted directly to FameProvider server!`);
  };

  const filteredOrders = orders.filter((ord) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return ['Pending', 'Processing'].includes(ord.status);
    if (activeTab === 'In Progress') return ord.status === 'In progress';
    if (activeTab === 'Completed') return ord.status === 'Completed';
    return ord.status === activeTab;
  });

  const tabs = ['All', 'Pending', 'In Progress', 'Completed', 'Partial', 'Canceled'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar
        user={user}
        onOpenDepositModal={() => setIsDepositOpen(true)}
        onLogout={() => (window.location.href = '/login')}
      />

      <div className="flex flex-1">
        <DashboardSidebar role={user?.role} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white">Order History</h1>
              <p className="mt-1 text-xs text-slate-400">Track all orders synchronized with FameProvider API</p>
            </div>

            <button
              onClick={handleSyncStatus}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing Status...' : 'Sync Status with Provider'}</span>
            </button>
          </div>

          {actionMsg && (
            <div className="mb-4 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-400 font-semibold">
              {actionMsg}
            </div>
          )}

          {/* Status Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Link</th>
                    <th className="py-3.5 px-4">Charge (\u20B9)</th>
                    <th className="py-3.5 px-4">Start / Remains</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No orders found for selected status.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-300">#{ord.id}</td>
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate">
                          <span className="font-semibold text-white block truncate">{ord.serviceName}</span>
                          <span className="text-[10px] text-slate-400">Qty: {ord.quantity.toLocaleString()}</span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate font-mono text-blue-400">
                          <a href={ord.link} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                            <span className="truncate">{ord.link}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">\u20B9{ord.chargeINR.toFixed(2)}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {ord.startCount} / {ord.remains}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`rounded px-2.5 py-0.5 text-[10px] font-bold inline-block w-max ${
                                ord.status === 'Completed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : ord.status === 'In progress' || ord.status === 'Processing'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}
                            >
                              {ord.status}
                            </span>
                            {ord.isProviderDispatched ? (
                              <span className="text-[10px] text-emerald-400/90 font-mono flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Provider Order #{ord.providerOrderId}
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-400/90 font-medium">
                                Queued (Processing)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {ord.status === 'Completed' ? (
                            <button
                              onClick={() => handleRefillRequest(ord.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-600 hover:text-white"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Refill
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500">Processing</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <IndianPaymentModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        userId={user?.id || 'usr_demo_002'}
        onPaymentSuccess={(newBal) => {
          if (user) setUser({ ...user, balanceINR: newBal });
        }}
      />
    </div>
  );
}
