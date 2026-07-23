'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { RefreshCw, Lock, Unlock, DollarSign, Save, Search, AlertCircle } from 'lucide-react';
import { SMMService, SystemSettings, User } from '@/lib/types';

export default function AdminServicesPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [services, setServices] = useState<SMMService[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [usdRateInput, setUsdRateInput] = useState('87.00');
  const [marginInput, setMarginInput] = useState('35');
  const [savingSettings, setSavingSettings] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchData = () => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.services) setServices(data.services);
        if (data.usdToInrRate) setUsdRateInput(String(data.usdToInrRate));
      });

    fetch('/api/admin?action=overview')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
          setUsdRateInput(String(data.settings.usdToInrRate));
          setMarginInput(String(data.settings.globalMarginPercent));
        }
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

    fetchData();
  }, []);

  const handleUpdateGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          settings: {
            usdToInrRate: parseFloat(usdRateInput) || 87.0,
            globalMarginPercent: parseFloat(marginInput) || 35,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg('Global USD->INR rate & margins saved! Selling rates recalculated.');
        fetchData();
      }
    } catch (err) {
      setMsg('Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTogglePriceLock = async (srv: SMMService) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_service_price',
          serviceId: srv.id,
          sellingRateINR: srv.sellingRateINR,
          isPriceLocked: !srv.isPriceLocked,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCustomPriceChange = async (srv: SMMService, newPrice: number) => {
    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_service_price',
          serviceId: srv.id,
          sellingRateINR: newPrice,
          isPriceLocked: true, // Auto lock when price manually changed
        }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.providerServiceId).includes(searchQuery) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar user={adminUser} onLogout={() => (window.location.href = '/login')} />

      <div className="flex flex-1">
        <DashboardSidebar role="super_admin" isAdminNav={true} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Price & Exchange Rate Management</h1>
            <p className="mt-1 text-xs text-slate-400">Control USD to INR exchange rates, profit margins & custom price locks</p>
          </div>

          {msg && (
            <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-semibold">
              {msg}
            </div>
          )}

          {/* Global Exchange & Margin Settings Form */}
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 mb-4">
              Global USD (\u0024) to INR (\u20B9) Exchange Engine
            </h2>

            <form onSubmit={handleUpdateGlobalSettings} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Manual Exchange Rate (1 USD = ? INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">\u20B9</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={usdRateInput}
                    onChange={(e) => setUsdRateInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-8 pr-3 text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Global Profit Margin (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    required
                    value={marginInput}
                    onChange={(e) => setMarginInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-xs font-bold text-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">%</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 px-5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>Save & Recalculate Prices</span>
              </button>
            </form>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Service Catalog & Price Overrides</h2>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services or ID..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Service Name</th>
                    <th className="py-3.5 px-4">Provider Rate ($)</th>
                    <th className="py-3.5 px-4">Cost (\u20B9)</th>
                    <th className="py-3.5 px-4">Selling Price (\u20B9 / 1K)</th>
                    <th className="py-3.5 px-4">Lock Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredServices.map((srv) => (
                    <tr key={srv.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-300">#{srv.providerServiceId}</td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-bold text-white block truncate">{srv.name}</span>
                        <span className="text-[10px] text-slate-400">{srv.category}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">\u0024{srv.providerRateUSD}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">\u20B9{srv.calculatedRateINR.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          step="0.10"
                          value={srv.sellingRateINR}
                          onChange={(e) => handleCustomPriceChange(srv, parseFloat(e.target.value) || 0)}
                          className="w-24 rounded-lg border border-slate-700 bg-slate-950 py-1 px-2 font-mono font-bold text-emerald-400 text-xs focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePriceLock(srv)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold border transition-colors ${
                            srv.isPriceLocked
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          {srv.isPriceLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                          <span>{srv.isPriceLocked ? 'Locked' : 'Auto Sync'}</span>
                        </button>
                      </td>
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
