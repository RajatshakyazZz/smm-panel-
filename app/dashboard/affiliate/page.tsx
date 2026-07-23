'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import IndianPaymentModal from '@/components/IndianPaymentModal';
import { Users, Copy, CheckCircle2, Gift, DollarSign, ArrowUpRight } from 'lucide-react';
import { User } from '@/lib/types';

export default function AffiliatePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
  }, []);

  const referralLink = `https://fameprovider.com/signup?ref=${user?.username || 'rajat_creator'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Affiliate & Referral Program</h1>
            <p className="mt-1 text-xs text-slate-400">Earn 5% lifetime commission on every deposit made by your referrals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Commission Rate</span>
              <span className="text-3xl font-black text-blue-400 mt-2 block">5.0%</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Lifetime on all deposits</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Referrals</span>
              <span className="text-3xl font-black text-white mt-2 block">12</span>
              <span className="text-[11px] text-emerald-400 mt-1 block">● 8 Active Paying Creators</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Earnings (\u20B9)</span>
              <span className="text-3xl font-black text-emerald-400 font-mono mt-2 block">\u20B91,240.00</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Auto-credited to wallet balance</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl space-y-4">
            <h2 className="text-sm font-bold text-white">Your Referral Link</h2>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs font-mono text-blue-400 select-all focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
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
