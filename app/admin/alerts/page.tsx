'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Bell, CheckCircle2, ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import { PriceAlert, User } from '@/lib/types';

export default function AdminAlertsPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  const fetchAlerts = () => {
    fetch('/api/admin?action=alerts')
      .then((res) => res.json())
      .then((data) => {
        if (data.alerts) setAlerts(data.alerts);
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

    fetchAlerts();
  }, []);

  const handleResolveAlert = async (id: string) => {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resolve_alert', alertId: id }),
    });
    fetchAlerts();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar user={adminUser} onLogout={() => (window.location.href = '/login')} />

      <div className="flex flex-1">
        <DashboardSidebar role="super_admin" isAdminNav={true} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Provider Price Change Alerts</h1>
            <p className="mt-1 text-xs text-slate-400">Automated hourly cron detection for FameProvider rate hikes or price drops</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Service Name</th>
                    <th className="py-3.5 px-4">Field Changed</th>
                    <th className="py-3.5 px-4">Old Value</th>
                    <th className="py-3.5 px-4">New Value</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {alerts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No provider price alerts recorded. Click &quot;Sync Services Now&quot; on Executive Dashboard to trigger automatic rate comparison!
                      </td>
                    </tr>
                  ) : (
                    alerts.map((alt) => (
                      <tr key={alt.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(alt.createdAt).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                          #{alt.providerServiceId} - {alt.serviceName}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-amber-400 uppercase">{alt.field}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 line-through">{alt.oldValue}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{alt.newValue}</td>
                        <td className="py-3.5 px-4 text-right">
                          {alt.isResolved ? (
                            <span className="text-[10px] text-slate-500 font-bold">Resolved</span>
                          ) : (
                            <button
                              onClick={() => handleResolveAlert(alt.id)}
                              className="rounded-lg bg-blue-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-blue-500"
                            >
                              Acknowledge
                            </button>
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
    </div>
  );
}
