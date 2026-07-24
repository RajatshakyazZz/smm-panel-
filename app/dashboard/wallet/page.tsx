'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import IndianPaymentModal from '@/components/IndianPaymentModal';
import { Wallet, Plus, CreditCard, ShieldCheck, CheckCircle2, History } from 'lucide-react';
import { User, WalletTransaction, PaymentGatewayConfig } from '@/lib/types';

export default function WalletPage() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

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

    fetch('/api/wallet?userId=usr_demo_002')
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) setTransactions(data.transactions);
        if (data.gateways) setGateways(data.gateways);
      });
  }, []);

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
              <h1 className="text-2xl font-black text-white">Wallet & Add Funds (₹)</h1>
              <p className="mt-1 text-xs text-slate-400">Recharge your wallet balance using official Indian Payment Gateways</p>
            </div>

            <button
              onClick={() => setIsDepositOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500"
            >
              <Plus className="h-4 w-4" />
              <span>Add Funds in ₹ Now</span>
            </button>
          </div>

          {/* Current Balance Banner */}
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Wallet className="h-7 w-7" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Balance</span>
                <span className="text-3xl font-black text-white font-mono">₹{user ? user.balanceINR.toFixed(2) : '0.00'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">100% Secure Instant UPI & Card Processing</span>
            </div>
          </div>

          {/* Supported Gateways Grid */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Supported Indian Gateways</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gateways.map((gw) => (
                <div key={gw.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{gw.name}</span>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{gw.description}</p>
                  <div className="pt-2 flex justify-between text-[11px] text-slate-500 border-t border-slate-800/80">
                    <span>Min: ₹{gw.minAmountINR}</span>
                    <span>Fee: {gw.feePercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deposit History */}
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Wallet Transactions History</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Tx ID</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Gateway</th>
                      <th className="py-3.5 px-4">Amount (₹)</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          No deposit transactions recorded yet. Click &quot;Add Funds&quot; to test wallet recharge!
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-300">{tx.transactionRef}</td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {new Date(tx.createdAt).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-white">{tx.gatewayName}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">+₹{tx.amountINR.toFixed(2)}</td>
                          <td className="py-3.5 px-4">
                            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
          fetch('/api/wallet?userId=usr_demo_002')
            .then((res) => res.json())
            .then((data) => {
              if (data.transactions) setTransactions(data.transactions);
            });
        }}
      />
    </div>
  );
}
