'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import IndianPaymentModal from '@/components/IndianPaymentModal';
import { ListPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { User, SMMService } from '@/lib/types';

export default function MassOrderPage() {
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<SMMService[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const [rawInput, setRawInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.services) setServices(data.services);
      });
  }, []);

  const handleMassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rawInput.trim()) {
      setMsg({ type: 'error', text: 'Please paste mass orders in format: service_id | link | quantity' });
      return;
    }

    const lines = rawInput.trim().split('\n');
    const massOrders = [];

    for (const line of lines) {
      const parts = line.split('|').map((p) => p.trim());
      if (parts.length >= 3) {
        const pSrvId = parseInt(parts[0], 10);
        const link = parts[1];
        const quantity = parseInt(parts[2], 10);

        const foundService = services.find((s) => s.providerServiceId === pSrvId || s.id === parts[0]);
        if (foundService && link && quantity) {
          massOrders.push({
            serviceId: foundService.id,
            link,
            quantity,
          });
        }
      }
    }

    if (massOrders.length === 0) {
      setMsg({ type: 'error', text: 'No valid order lines found. Check service ID format.' });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mass',
          userId: user.id,
          massOrders,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: `Successfully processed ${data.count} mass orders! ₹${data.totalSpent} deducted.` });
        if (data.totalSpent) {
          setUser({ ...user, balanceINR: user.balanceINR - data.totalSpent, spentINR: user.spentINR + data.totalSpent });
        }
        setRawInput('');
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to process mass orders.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Server connection error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar
        user={user}
        onOpenDepositModal={() => setIsDepositOpen(true)}
        onLogout={() => (window.location.href = '/login')}
      />

      <div className="flex flex-1">
        <DashboardSidebar role={user?.role} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Place Mass Orders</h1>
            <p className="mt-1 text-xs text-slate-400">Place multiple orders at once format: service_id | link | quantity</p>
          </div>

          {msg && (
            <div
              className={`mb-6 rounded-2xl p-4 text-xs border ${
                msg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {msg.text}
            </div>
          )}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs text-blue-300">
              <span className="font-bold block mb-1">Mass Order Format Example:</span>
              <pre className="font-mono bg-slate-950/60 p-2.5 rounded-lg text-slate-200 text-[11px]">
                101 | https://instagram.com/post1 | 1000&#10;
                202 | https://instagram.com/reel2 | 5000&#10;
                301 | https://youtube.com/watch?v=xyz | 500
              </pre>
            </div>

            <form onSubmit={handleMassSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Orders Input</label>
                <textarea
                  rows={8}
                  required
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="101 | https://instagram.com/post1 | 1000"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs font-mono text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50"
              >
                {loading ? 'Processing Mass Orders...' : 'Submit Mass Orders'}
              </button>
            </form>
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
