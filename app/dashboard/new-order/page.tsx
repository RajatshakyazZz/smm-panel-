'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import IndianPaymentModal from '@/components/IndianPaymentModal';
import { ShoppingCart, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { User, SMMCategory, SMMService } from '@/lib/types';

export default function NewOrderPage() {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<SMMCategory[]>([]);
  const [services, setServices] = useState<SMMService[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [comments, setComments] = useState('');
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
        if (data.categories) setCategories(data.categories);
        if (data.services) {
          setServices(data.services);
          if (data.categories?.length > 0) {
            setSelectedCategory(data.categories[0].name);
            const catServices = data.services.filter((s: SMMService) => s.category === data.categories[0].name);
            if (catServices.length > 0) {
              setSelectedServiceId(catServices[0].id);
              setQuantity(String(catServices[0].minQuantity));
            }
          }
        }
      });
  }, []);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const qty = parseInt(quantity, 10) || 0;
  const chargeINR = selectedService ? Number(((selectedService.sellingRateINR * qty) / 1000).toFixed(2)) : 0;

  const handleCategoryChange = (catName: string) => {
    setSelectedCategory(catName);
    const catServices = services.filter((s) => s.category === catName);
    if (catServices.length > 0) {
      setSelectedServiceId(catServices[0].id);
      setQuantity(String(catServices[0].minQuantity));
    } else {
      setSelectedServiceId('');
    }
  };

  const handleServiceChange = (srvId: string) => {
    setSelectedServiceId(srvId);
    const srv = services.find((s) => s.id === srvId);
    if (srv) {
      setQuantity(String(srv.minQuantity));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedService || !link || !qty) {
      setMsg({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          userId: user.id,
          serviceId: selectedService.id,
          link,
          quantity: qty,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setMsg({ type: 'success', text: `Order #${data.order.id} placed successfully! ₹${data.order.chargeINR} deducted from wallet.` });
        setUser({ ...user, balanceINR: user.balanceINR - data.order.chargeINR, spentINR: user.spentINR + data.order.chargeINR });
        setLink('');
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to place order.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Network connection error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <DashboardNavbar
        user={user}
        onOpenDepositModal={() => setIsDepositOpen(true)}
        onLogout={() => (window.location.href = '/login')}
      />

      <div className="flex flex-1">
        <DashboardSidebar role={user?.role} />

        <main className="flex-1 p-6 lg:p-8 max-w-4xl mx-auto w-full">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Place New SMM Order</h1>
              <p className="mt-1 text-xs text-slate-500">Automatic order dispatch via FameProvider API in Indian Rupees (₹)</p>
            </div>
          </div>

          {msg && (
            <div
              className={`mb-6 rounded-2xl p-4 text-xs font-medium border ${
                msg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {msg.text}
            </div>
          )}

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Service</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {services
                    .filter((s) => s.category === selectedCategory)
                    .map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        #{srv.providerServiceId} - {srv.name} - ₹{srv.sellingRateINR}/1K
                      </option>
                    ))}
                </select>
              </div>

              {/* Service Info Box */}
              {selectedService && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs space-y-2 text-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Price per 1,000 units:</span>
                    <span className="font-bold text-emerald-600 text-sm">₹{selectedService.sellingRateINR.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Min / Max Limit:</span>
                    <span className="font-semibold text-slate-800">{selectedService.minQuantity.toLocaleString()} - {selectedService.maxQuantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Refill Guarantee:</span>
                    <span className={`font-semibold ${selectedService.refillSupported ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {selectedService.refillSupported ? '✓ 30 Days Auto Refill' : 'No Refill'}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-500 leading-relaxed whitespace-pre-line">
                    {selectedService.description}
                  </div>
                </div>
              )}

              {/* Target Link */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Link / URL</label>
                <input
                  type="url"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://instagram.com/p/your_post_link"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quantity</label>
                <input
                  type="number"
                  required
                  min={selectedService?.minQuantity || 10}
                  max={selectedService?.maxQuantity || 1000000}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Custom Comments if custom service */}
              {selectedService?.type === 'Custom Comments' && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Custom Comments (1 line per comment)</label>
                  <textarea
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Great post!&#10;Awesome pic!&#10;Love this!"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              )}

              {/* Price Calculation Summary */}
              <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-100 p-4">
                <div>
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Total Charge</span>
                  <span className="text-[10px] text-slate-400">Auto deducted from wallet in ₹</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 font-mono">
                  ₹{chargeINR.toFixed(2)}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedService}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 text-sm"
              >
                {loading ? 'Submitting Order to FameProvider...' : `Confirm Order (₹${chargeINR.toFixed(2)})`}
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
