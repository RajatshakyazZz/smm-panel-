'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Settings, Save, Server, ShieldCheck, Key } from 'lucide-react';
import { SystemSettings, User } from '@/lib/types';

export default function AdminSettingsPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [providerApiKey, setProviderApiKey] = useState('demo_fameprovider_api_key_88321');
  const [usdRate, setUsdRate] = useState('87.00');
  const [margin, setMargin] = useState('35');
  const [msg, setMsg] = useState('');

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

    fetch('/api/admin?action=overview')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setProviderApiKey(data.settings.fameProviderApiKey);
          setUsdRate(String(data.settings.usdToInrRate));
          setMargin(String(data.settings.globalMarginPercent));
        }
      });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          settings: {
            fameProviderApiKey: providerApiKey,
            usdToInrRate: parseFloat(usdRate) || 87.0,
            globalMarginPercent: parseFloat(margin) || 35,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg('FameProvider API Key & Global Settings Saved!');
      }
    } catch (err) {
      setMsg('Error saving settings');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar user={adminUser} onLogout={() => (window.location.href = '/login')} />

      <div className="flex flex-1">
        <DashboardSidebar role="super_admin" isAdminNav={true} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">System & Provider Configuration</h1>
            <p className="mt-1 text-xs text-slate-400">Manage connection credentials for FameProvider API (v2) server</p>
          </div>

          {msg && <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-semibold">{msg}</div>}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">FameProvider API Endpoint</label>
                <input
                  type="text"
                  readOnly
                  value="https://fameprovider.com/api/v2"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs font-mono text-blue-400 select-all focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">FameProvider Secret API Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={providerApiKey}
                    onChange={(e) => setProviderApiKey(e.target.value)}
                    placeholder="Enter your FameProvider API Key"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-9 pr-4 text-xs font-mono text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Default USD to INR Exchange Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={usdRate}
                    onChange={(e) => setUsdRate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Global Profit Margin (%)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={margin}
                    onChange={(e) => setMargin(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-purple-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-purple-500"
              >
                Save SMM Panel System Credentials
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
