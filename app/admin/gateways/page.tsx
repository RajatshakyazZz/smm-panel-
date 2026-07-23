'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { CreditCard, Save, CheckCircle2, ShieldCheck, Key } from 'lucide-react';
import { PaymentGatewayConfig, User } from '@/lib/types';

export default function AdminGatewaysPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [msg, setMsg] = useState('');

  const fetchGateways = () => {
    fetch('/api/wallet?userId=usr_demo_002')
      .then((res) => res.json())
      .then((data) => {
        if (data.gateways) setGateways(data.gateways);
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

    fetchGateways();
  }, []);

  const handleToggleGateway = (gwId: string) => {
    setGateways(
      gateways.map((g) => (g.id === gwId ? { ...g, enabled: !g.enabled } : g))
    );
  };

  const handleSaveGateways = () => {
    setMsg('Indian Payment Gateway configurations updated successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar user={adminUser} onLogout={() => (window.location.href = '/login')} />

      <div className="flex flex-1">
        <DashboardSidebar role="super_admin" isAdminNav={true} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">Indian Payment Gateways</h1>
              <p className="mt-1 text-xs text-slate-400">Merchant credentials & fee controls for PhonePe, Paytm, Razorpay, Cashfree & Easebuzz</p>
            </div>

            <button
              onClick={handleSaveGateways}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500"
            >
              <Save className="h-4 w-4" />
              <span>Save Credentials</span>
            </button>
          </div>

          {msg && <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-semibold">{msg}</div>}

          <div className="space-y-6">
            {gateways.map((gw) => (
              <div key={gw.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-purple-400" />
                    <div>
                      <h3 className="font-bold text-white text-sm">{gw.name}</h3>
                      <p className="text-xs text-slate-400">{gw.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleGateway(gw.id)}
                    className={`rounded-xl px-4 py-1.5 text-xs font-bold border ${
                      gw.enabled
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {gw.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Merchant ID / Key ID</label>
                    <input
                      type="text"
                      defaultValue={gw.merchantId || 'MERCHANT_LIVE_KEY_8921'}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Secret Key / Salt</label>
                    <input
                      type="password"
                      defaultValue="••••••••••••••••••••"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Min Deposit (\u20B9)</label>
                    <input
                      type="number"
                      defaultValue={gw.minAmountINR}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-bold text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
