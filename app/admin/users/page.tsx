'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Users, Plus, Minus, Wallet, ShieldCheck } from 'lucide-react';
import { User } from '@/lib/types';

export default function AdminUsersPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amountInput, setAmountInput] = useState('500');
  const [isCredit, setIsCredit] = useState(true);
  const [reason, setReason] = useState('Admin Bonus Credit');
  const [msg, setMsg] = useState('');

  const fetchUsers = () => {
    fetch('/api/admin?action=users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsersList(data.users);
      });
  };

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('smm_user') : null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'super_admin') {
          setAdminUser(parsed);
          fetchUsers();
          return;
        }
      } catch (e) {}
    }
    window.location.href = '/login?error=admin_access_required';
  }, []);

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !amountInput) return;

    setMsg('');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'adjust_user_balance',
          userId: selectedUser.id,
          balanceINR: parseFloat(amountInput),
          isCredit,
          reason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(`Adjusted balance for ${selectedUser.username}!`);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (err) {
      setMsg('Failed to adjust balance');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar user={adminUser} onLogout={() => (window.location.href = '/login')} />

      <div className="flex flex-1">
        <DashboardSidebar role="super_admin" isAdminNav={true} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Registered User Accounts</h1>
            <p className="mt-1 text-xs text-slate-400">Manage user wallet balances in ₹, permissions and active status</p>
          </div>

          {msg && <div className="mb-4 text-xs font-bold text-emerald-400">{msg}</div>}

          {/* Balance Adjustment Modal Box */}
          {selectedUser && (
            <div className="mb-8 rounded-2xl border border-purple-500/30 bg-purple-950/20 p-6 shadow-xl">
              <h2 className="text-sm font-bold text-white mb-3">
                Adjust Balance for: <span className="text-purple-400 font-mono">{selectedUser.username}</span> (₹{selectedUser.balanceINR.toFixed(2)})
              </h2>

              <form onSubmit={handleAdjustBalance} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Action Type</label>
                  <select
                    value={isCredit ? 'credit' : 'debit'}
                    onChange={(e) => setIsCredit(e.target.value === 'credit')}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                  >
                    <option value="credit">Add Balance (Credit +)</option>
                    <option value="debit">Deduct Balance (Debit -)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Note</label>
                  <input
                    type="text"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white hover:bg-purple-500"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">User ID</th>
                    <th className="py-3.5 px-4">Username</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Balance (₹)</th>
                    <th className="py-3.5 px-4">Spent (₹)</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">{usr.id}</td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {usr.username}
                        <span className="block text-[10px] text-slate-500 font-normal">{usr.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 uppercase">
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">₹{usr.balanceINR.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">₹{usr.spentINR.toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedUser(usr)}
                          className="rounded-lg bg-blue-600/20 border border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-400 hover:bg-blue-600 hover:text-white"
                        >
                          Edit Balance
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
