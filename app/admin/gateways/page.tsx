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

          {/* Solution Banner for No Payment Gateway */}
          <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-black text-lg">
                💡
              </div>
              <div className="space-y-2">
                <h2 className="text-base font-bold text-white">Bina Payment Gateway ke Panel Kaise Chalaye? (Zero Gateway Solution)</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Agar aapke paas koi official Merchant Payment Gateway (Razorpay/PhonePe Merchant) nahi hai, tab bhi aap apna SMM Panel 100% chalasaate hain. India me maximum panel owners yahi solutions use karte hain:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                    <span className="text-xs font-bold text-amber-400 block mb-1">1. Personal UPI QR Code</span>
                    <p className="text-[11px] text-slate-400">Apna PhonePe / Paytm / GPay ka Personal QR Code ya UPI ID set karein. User QR scan karke direct aapke bank me pay karega.</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">2. Instant UTR / Reference No.</span>
                    <p className="text-[11px] text-slate-400">Payment ke baad user 12-digit UTR Number enter karega. Panel auto-match karke ya aap 1-click me approve kar sakte hain.</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                    <span className="text-xs font-bold text-purple-400 block mb-1">3. Admin Manual Balance Credit</span>
                    <p className="text-[11px] text-slate-400">WhatsApp par payment aane par aap <strong className="text-white">Admin Panel → Registered Users</strong> me jaakar kisi bhi user ka wallet balance 1 second me Add kar sakte hain.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Min Deposit (₹)</label>
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
