'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { CreditCard, Save, CheckCircle2, ShieldCheck, QrCode, Sparkles } from 'lucide-react';
import { PaymentGatewayConfig, User } from '@/lib/types';

export default function AdminGatewaysPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [pendingTxs, setPendingTxs] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchGateways = () => {
    fetch('/api/wallet?userId=usr_demo_002')
      .then((res) => res.json())
      .then((data) => {
        if (data.gateways) setGateways(data.gateways);
        if (data.transactions) {
          const pending = data.transactions.filter((t: any) => t.status === 'PENDING');
          setPendingTxs(pending);
        }
      });
  };

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('smm_user') : null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'super_admin') {
          setAdminUser(parsed);
          fetchGateways();
          return;
        }
      } catch (e) {}
    }
    window.location.href = '/login?error=admin_access_required';
  }, []);

  const handleApproveTx = async (txId: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_deposit', txId }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(data.message || 'Deposit approved successfully!');
        fetchGateways();
      } else {
        alert(data.error || 'Failed to approve');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  const handleRejectTx = async (txId: string) => {
    if (!confirm('Are you sure you want to REJECT this deposit request? User balance will NOT be credited.')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject_deposit', txId }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Deposit request rejected.');
        fetchGateways();
      } else {
        alert(data.error || 'Failed to reject');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  const handleFieldChange = (code: string, field: string, value: any) => {
    setGateways(
      gateways.map((g) => (g.code === code ? { ...g, [field]: value } : g))
    );
  };

  const handleToggleGateway = (code: string) => {
    setGateways(
      gateways.map((g) => (g.code === code ? { ...g, enabled: !g.enabled } : g))
    );
  };

  const handleSaveGateways = async () => {
    setSaving(true);
    setMsg('');

    try {
      for (const gw of gateways) {
        await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_gateway',
            gatewayCode: gw.code,
            gatewayUpdates: {
              enabled: gw.enabled,
              upiId: gw.upiId,
              upiName: gw.upiName,
              qrImageUrl: gw.qrImageUrl,
              merchantId: gw.merchantId,
              apiKey: gw.apiKey,
              minAmountINR: Number(gw.minAmountINR) || 10,
              maxAmountINR: Number(gw.maxAmountINR) || 100000,
            },
          }),
        });
      }

      setMsg('Payment Gateways & Personal UPI QR settings updated successfully!');
      fetchGateways();
    } catch (err) {
      setMsg('Error saving gateway configurations.');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const personalUpiGw = gateways.find((g) => g.code === 'personal_upi');
  const merchantGws = gateways.filter((g) => g.code !== 'personal_upi');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar user={adminUser} onLogout={() => (window.location.href = '/login')} />

      <div className="flex flex-1">
        <DashboardSidebar role="super_admin" isAdminNav={true} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">Payment Gateways & Personal UPI</h1>
              <p className="mt-1 text-xs text-slate-400">Configure Personal PhonePe/GPay QR code or Merchant Gateways for wallet recharges</p>
            </div>

            <button
              onClick={handleSaveGateways}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

          {msg && (
            <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{msg}</span>
            </div>
          )}

          {/* PENDING DEPOSITS VERIFICATION DESK */}
          {pendingTxs.length > 0 && (
            <div className="mb-8 rounded-2xl border-2 border-amber-500/50 bg-amber-950/30 p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-bold">
                    ⏳
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <span>Pending UPI Deposit Requests</span>
                      <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-extrabold text-slate-950">
                        {pendingTxs.length} Waiting Verification
                      </span>
                    </h2>
                    <p className="text-xs text-slate-300">
                      Users submitted UTRs for payment. Verify in your PhonePe / GPay / Paytm bank statement before approving.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {pendingTxs.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/90 p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <span>User: <strong className="text-purple-400">{tx.username}</strong></span>
                        <span className="text-slate-600">•</span>
                        <span className="text-amber-300">Amount: ₹{tx.amountINR}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-400 font-mono">
                        <span>UTR / Ref: <strong className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{tx.transactionRef}</strong></span>
                        <span>Gateway: {tx.gatewayName}</span>
                        <span>Time: {new Date(tx.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => handleRejectTx(tx.id)}
                        className="flex-1 md:flex-initial rounded-xl bg-red-600/20 border border-red-500/30 px-3.5 py-2 text-xs font-bold text-red-300 hover:bg-red-600/30"
                      >
                        Reject Fake UTR
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveTx(tx.id)}
                        className="flex-1 md:flex-initial rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500"
                      >
                        ✓ Approve & Credit ₹{tx.netINR}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-black text-lg">
                💡
              </div>
              <div className="space-y-2">
                <h2 className="text-base font-bold text-white">Bina Merchant Gateway ke Panel Chalaye (Method 1: Personal UPI)</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Agar aapke paas koi official Merchant Payment Gateway nahi hai, toh neeche apna <strong className="text-amber-300">Personal PhonePe/Paytm/GPay UPI ID</strong> daal kar save kar dein. Users QR scan karke direct aapke bank account me pay karenge!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                    <span className="text-xs font-bold text-amber-400 block mb-1">1. Setup Personal UPI ID</span>
                    <p className="text-[11px] text-slate-400">Neeche box me apna Google Pay / PhonePe / Paytm UPI ID daalein.</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">2. Auto QR Generation</span>
                    <p className="text-[11px] text-slate-400">System aapke UPI ID ka live QR code customer ke Add Funds modal me dikhaega.</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3.5">
                    <span className="text-xs font-bold text-purple-400 block mb-1">3. UTR Reference Verification</span>
                    <p className="text-[11px] text-slate-400">User payment ke baad 12-digit UTR enter karega aur wallet balance तुरंत credit ho jaega.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* METHOD 1: DEDICATED PERSONAL UPI CONFIGURATION CARD */}
          {personalUpiGw && (
            <div className="mb-8 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-950/30 to-slate-900/90 p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Recommended (No Gateway Needed)
              </div>

              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                      <span>Method 1: Personal UPI QR Code & UPI ID (Direct Bank)</span>
                      <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400" />
                    </h2>
                    <p className="text-xs text-slate-300">Set your personal UPI ID (PhonePe, Paytm, Google Pay, BHIM) to receive 100% direct bank deposits</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleGateway('personal_upi')}
                  className={`rounded-xl px-4 py-2 text-xs font-bold border transition-all ${
                    personalUpiGw.enabled
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {personalUpiGw.enabled ? '● Active Method' : 'Disabled'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1.5">Your Personal UPI ID (VPA)</label>
                  <input
                    type="text"
                    value={personalUpiGw.upiId || ''}
                    onChange={(e) => handleFieldChange('personal_upi', 'upiId', e.target.value)}
                    placeholder="e.g. 9876543210@paytm or yourname@ybl"
                    className="w-full rounded-xl border border-amber-500/30 bg-slate-950 p-3 text-sm font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">Example: phonepe 9876543210@ybl, GPay user@okaxis, Paytm 9876543210@paytm</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Receiver / Business Name</label>
                  <input
                    type="text"
                    value={personalUpiGw.upiName || ''}
                    onChange={(e) => handleFieldChange('personal_upi', 'upiName', e.target.value)}
                    placeholder="e.g. Royal SMM Panel Owner"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">Name shown on UPI Apps when customers scan QR code</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 border-t border-slate-800/80 pt-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Verification & Anti-Fraud Mode</label>
                  <select
                    value={personalUpiGw.requireApproval ? 'manual' : 'auto'}
                    onChange={(e) => handleFieldChange('personal_upi', 'requireApproval', e.target.value === 'manual')}
                    className="w-full rounded-xl border border-amber-500/40 bg-slate-950 p-2.5 text-xs font-bold text-amber-300 focus:outline-none"
                  >
                    <option value="manual">🔒 Manual Admin Verification (Secure)</option>
                    <option value="auto">⚡ Instant Auto Credit (Demo Mode)</option>
                  </select>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {personalUpiGw.requireApproval
                      ? 'Secure: Admin checks bank/PhonePe statement before approving deposit.'
                      : 'Instant: Credits balance immediately upon UTR submission.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Custom QR Image URL (Optional)</label>
                  <input
                    type="text"
                    value={personalUpiGw.qrImageUrl || ''}
                    onChange={(e) => handleFieldChange('personal_upi', 'qrImageUrl', e.target.value)}
                    placeholder="Leave empty for auto QR code"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Min Deposit (₹)</label>
                  <input
                    type="number"
                    value={personalUpiGw.minAmountINR}
                    onChange={(e) => handleFieldChange('personal_upi', 'minAmountINR', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-bold text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Max Deposit (₹)</label>
                  <input
                    type="number"
                    value={personalUpiGw.maxAmountINR}
                    onChange={(e) => handleFieldChange('personal_upi', 'maxAmountINR', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-bold text-white"
                  />
                </div>
              </div>

              {/* QR Preview */}
              {personalUpiGw.upiId && (
                <div className="mt-5 rounded-xl bg-slate-950/80 p-4 border border-slate-800 flex items-center gap-4">
                  <div className="h-20 w-20 bg-white p-1 rounded-lg shrink-0">
                    <img
                      src={
                        personalUpiGw.qrImageUrl ||
                        `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                          `upi://pay?pa=${personalUpiGw.upiId}&pn=${encodeURIComponent(
                            personalUpiGw.upiName || 'SMM Panel'
                          )}&cu=INR`
                        )}&size=150x150`
                      }
                      alt="Live Dynamic QR Preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="text-xs">
                    <span className="text-emerald-400 font-bold block mb-0.5">✓ Live Dynamic QR Code Active</span>
                    <p className="text-slate-300">
                      Users scanning this QR code in user dashboard will send funds directly to: <strong className="text-amber-300 font-mono">{personalUpiGw.upiId}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OTHER MERCHANT GATEWAYS */}
          <h2 className="text-base font-bold text-white mb-4">Official Merchant Payment Gateways</h2>
          <div className="space-y-6">
            {merchantGws.map((gw) => (
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
                    type="button"
                    onClick={() => handleToggleGateway(gw.code)}
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
                      value={gw.merchantId || ''}
                      onChange={(e) => handleFieldChange(gw.code, 'merchantId', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Secret Key / Salt</label>
                    <input
                      type="password"
                      value={gw.apiKey || ''}
                      onChange={(e) => handleFieldChange(gw.code, 'apiKey', e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Min Deposit (₹)</label>
                    <input
                      type="number"
                      value={gw.minAmountINR}
                      onChange={(e) => handleFieldChange(gw.code, 'minAmountINR', e.target.value)}
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

