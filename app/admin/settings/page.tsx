'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Settings, Save, Server, ShieldCheck, Key, RefreshCw, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { SystemSettings, User } from '@/lib/types';

export default function AdminSettingsPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [providerApiKey, setProviderApiKey] = useState('demo_fameprovider_api_key_88321');
  const [usdRate, setUsdRate] = useState('87.00');
  const [margin, setMargin] = useState('35');
  const [msg, setMsg] = useState('');
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string; error?: string; balanceUSD?: number; balanceINR?: string } | null>(null);

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('smm_user') : null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'super_admin') {
          setAdminUser(parsed);
          fetch('/api/admin?action=overview')
            .then((res) => res.json())
            .then((data) => {
              if (data.settings) {
                setProviderApiKey(data.settings.fameProviderApiKey);
                setUsdRate(String(data.settings.usdToInrRate));
                setMargin(String(data.settings.globalMarginPercent));
              }
            });
          return;
        }
      } catch (e) {}
    }
    window.location.href = '/login?error=admin_access_required';
  }, []);

  const handleTestApiKey = async () => {
    setTestingKey(true);
    setTestResult(null);
    try {
      const res = await fetch(`/api/admin?action=test_provider_api&key=${encodeURIComponent(providerApiKey)}`);
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, error: 'Failed to communicate with provider test server' });
    } finally {
      setTestingKey(false);
    }
  };

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
        handleTestApiKey();
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

          {/* Explanation Banner */}
          <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs text-blue-200 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-1">How FameProvider Order Forwarding Works:</span>
              When customers place an order on your panel, the system calls FameProvider API using your API key below. To ensure orders appear on fameprovider.com, enter your secret API key from <a href="https://fameprovider.com/api" target="_blank" rel="noreferrer" className="underline font-semibold text-blue-300">fameprovider.com/api</a> and keep sufficient balance on your fameprovider.com account.
            </div>
          </div>

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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">FameProvider Secret API Key</label>
                  <button
                    type="button"
                    onClick={handleTestApiKey}
                    disabled={testingKey}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${testingKey ? 'animate-spin' : ''}`} />
                    <span>Test Connection & Balance</span>
                  </button>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={providerApiKey}
                    onChange={(e) => setProviderApiKey(e.target.value)}
                    placeholder="e.g., 9a8b7c6d5e4f3a2b1c0d or demo_fameprovider_key"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-9 pr-4 text-xs font-mono text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Test Result Callout */}
              {testResult && (
                <div className={`rounded-xl p-4 text-xs ${testResult.success ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'}`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {testResult.success ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>FameProvider API Connected Successfully!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        <span>FameProvider Connection Warning</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 leading-relaxed">
                    {testResult.success
                      ? `Provider Balance: $${testResult.balanceUSD} (₹${testResult.balanceINR}). Orders will be automatically forwarded to fameprovider.com.`
                      : testResult.error || 'Invalid API key or unable to connect. Orders will be saved locally until a valid key is provided.'}
                  </p>
                </div>
              )}

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

