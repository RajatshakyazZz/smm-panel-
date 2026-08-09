'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { CreditCard, Save, CheckCircle2, ShieldCheck, QrCode, Sparkles, Trash2, Plus, AlertCircle, X } from 'lucide-react';
import { PaymentGatewayConfig, User } from '@/lib/types';

export default function AdminGatewaysPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [pendingTxs, setPendingTxs] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Add Gateway Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGwName, setNewGwName] = useState('');
  const [newGwCode, setNewGwCode] = useState('');
  const [newGwTitle, setNewGwTitle] = useState('');
  const [newGwDesc, setNewGwDesc] = useState('');
  const [newGwUpiId, setNewGwUpiId] = useState('');
  const [newGwUpiName, setNewGwUpiName] = useState('');
  const [newGwQrUrl, setNewGwQrUrl] = useState('');
  const [newGwMerchantId, setNewGwMerchantId] = useState('');
  const [newGwApiKey, setNewGwApiKey] = useState('');
  const [newGwMinAmount, setNewGwMinAmount] = useState('10');
  const [newGwMaxAmount, setNewGwMaxAmount] = useState('100000');
  const [addingGw, setAddingGw] = useState(false);

  const fetchGateways = () => {
    fetch('/api/wallet')
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

  const handleDeleteGateway = async (code: string, name: string) => {
    if (!confirm(`Are you sure you want to REMOVE payment gateway "${name}"?`)) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_gateway', gatewayCode: code }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Gateway "${name}" deleted successfully.`);
        fetchGateways();
      } else {
        alert(data.error || 'Failed to delete gateway');
      }
    } catch (e) {
      alert('Network error while deleting gateway');
    }
  };

  const handleClearAllGateways = async () => {
    if (!confirm('⚠️ Are you sure you want to DELETE ALL PAYMENT GATEWAYS? Users will not see any payment options until you add a new gateway.')) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_all_gateways' }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('✓ All payment gateways removed successfully!');
        fetchGateways();
      } else {
        alert(data.error || 'Failed to remove gateways');
      }
    } catch (e) {
      alert('Network error while clearing gateways');
    }
  };

  const handleAddGateway = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGwName || !newGwCode) {
      alert('Gateway Name and Code are required.');
      return;
    }

    setAddingGw(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_gateway',
          gateway: {
            name: newGwName,
            code: newGwCode.trim().toLowerCase().replace(/\s+/g, '_'),
            title: newGwTitle || newGwName,
            description: newGwDesc,
            upiId: newGwUpiId,
            upiName: newGwUpiName,
            qrImageUrl: newGwQrUrl,
            merchantId: newGwMerchantId,
            apiKey: newGwApiKey,
            minAmountINR: Number(newGwMinAmount) || 10,
            maxAmountINR: Number(newGwMaxAmount) || 100000,
            enabled: true,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg(`✓ Gateway "${newGwName}" added successfully!`);
        setShowAddModal(false);
        setNewGwName('');
        setNewGwCode('');
        setNewGwTitle('');
        setNewGwDesc('');
        setNewGwUpiId('');
        setNewGwUpiName('');
        setNewGwQrUrl('');
        setNewGwMerchantId('');
        setNewGwApiKey('');
        fetchGateways();
      } else {
        alert(data.error || 'Failed to add gateway');
      }
    } catch (err) {
      alert('Network error adding gateway');
    } finally {
      setAddingGw(false);
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

      setMsg('Payment Gateways updated successfully!');
      fetchGateways();
    } catch (err) {
      setMsg('Error saving gateway configurations.');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar user={adminUser} onLogout={() => (window.location.href = '/login')} />

      <div className="flex flex-1">
        <DashboardSidebar role="super_admin" isAdminNav={true} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {/* Header Controls */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white">Payment Gateways Management</h1>
              <p className="mt-1 text-xs text-slate-400">Configure or add payment gateways and UPI payment methods for user wallet recharges</p>
            </div>

            <div className="flex items-center gap-2">
              {gateways.length > 0 && (
                <button
                  onClick={handleClearAllGateways}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove All Gateways</span>
                </button>
              )}

              <button
                onClick={() => setShowAddModal(true)}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add New Gateway</span>
              </button>

              {gateways.length > 0 && (
                <button
                  onClick={handleSaveGateways}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 disabled:opacity-50 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
                </button>
              )}
            </div>
          </div>

          {msg && (
            <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-400 font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          {/* ADD NEW GATEWAY MODAL */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Add New Custom Payment Gateway</h3>
                      <p className="text-xs text-slate-400">Configure your new preferred payment gateway or UPI method</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleAddGateway} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Gateway Name *</label>
                      <input
                        type="text"
                        required
                        value={newGwName}
                        onChange={(e) => setNewGwName(e.target.value)}
                        placeholder="e.g. PhonePe UPI Auto Gateway"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Unique Code ID *</label>
                      <input
                        type="text"
                        required
                        value={newGwCode}
                        onChange={(e) => setNewGwCode(e.target.value)}
                        placeholder="e.g. phonepe_new, custom_upi"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Title Displayed to Customers</label>
                    <input
                      type="text"
                      value={newGwTitle}
                      onChange={(e) => setNewGwTitle(e.target.value)}
                      placeholder="e.g. Instant UPI / NetBanking / Cards"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={newGwDesc}
                      onChange={(e) => setNewGwDesc(e.target.value)}
                      placeholder="e.g. Scan QR Code or Pay via PhonePe / Paytm / GPay"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">UPI ID (If UPI / QR Gateway)</label>
                      <input
                        type="text"
                        value={newGwUpiId}
                        onChange={(e) => setNewGwUpiId(e.target.value)}
                        placeholder="e.g. 9876543210@paytm"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-amber-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Account Holder / UPI Name</label>
                      <input
                        type="text"
                        value={newGwUpiName}
                        onChange={(e) => setNewGwUpiName(e.target.value)}
                        placeholder="e.g. SMM Panel"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Merchant ID / App ID (If API)</label>
                      <input
                        type="text"
                        value={newGwMerchantId}
                        onChange={(e) => setNewGwMerchantId(e.target.value)}
                        placeholder="Merchant ID"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">API Key / Secret (If API)</label>
                      <input
                        type="password"
                        value={newGwApiKey}
                        onChange={(e) => setNewGwApiKey(e.target.value)}
                        placeholder="Secret Key"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Min Deposit (₹)</label>
                      <input
                        type="number"
                        value={newGwMinAmount}
                        onChange={(e) => setNewGwMinAmount(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Max Deposit (₹)</label>
                      <input
                        type="number"
                        value={newGwMaxAmount}
                        onChange={(e) => setNewGwMaxAmount(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addingGw}
                      className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                    >
                      {addingGw ? 'Saving Gateway...' : 'Save New Gateway'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* EMPTY STATE WHEN ALL GATEWAYS ARE REMOVED */}
          {gateways.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-10 text-center space-y-4 my-6 shadow-2xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-lg font-black text-white">All Payment Gateways Successfully Removed</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                All old payment gateways have been completely removed from both user and admin sections. When you are ready to add your new payment gateway, click the button below!
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-extrabold text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add Your New Gateway Now</span>
              </button>
            </div>
          ) : (
            /* GATEWAYS LISTING */
            <div className="space-y-6">
              {gateways.map((gw) => (
                <div key={gw.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                        💳
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-sm">{gw.name}</h3>
                        <p className="text-xs text-slate-400">{gw.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleGateway(gw.code)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold border transition-all ${
                          gw.enabled
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                        }`}
                      >
                        {gw.enabled ? 'Enabled' : 'Disabled'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteGateway(gw.code, gw.name)}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-all"
                        title="Delete Gateway"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gateway Name</label>
                      <input
                        type="text"
                        value={gw.name}
                        onChange={(e) => handleFieldChange(gw.code, 'name', e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-bold text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-amber-300 mb-1">UPI ID (If UPI)</label>
                      <input
                        type="text"
                        value={gw.upiId || ''}
                        onChange={(e) => handleFieldChange(gw.code, 'upiId', e.target.value)}
                        placeholder="e.g. 9876543210@paytm"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-mono text-amber-300"
                      />
                    </div>

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
          )}
        </main>
      </div>
    </div>
  );
}
