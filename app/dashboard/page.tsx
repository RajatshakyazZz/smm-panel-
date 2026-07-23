'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import IndianPaymentModal from '@/components/IndianPaymentModal';
import Link from 'next/link';
import {
  Wallet,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Zap,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { User, SMMCategory, SMMService, SMMOrder } from '@/lib/types';

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<SMMCategory[]>([]);
  const [services, setServices] = useState<SMMService[]>([]);
  const [orders, setOrders] = useState<SMMOrder[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  // Form State for Quick Order
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMsg, setOrderMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Fetch initial user auth or use default demo user
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username: 'rajat_creator' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });

    // Fetch services & categories
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

    // Fetch orders
    fetch('/api/orders?userId=usr_demo_002')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      });
  }, []);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const qty = parseInt(quantity, 10) || 0;
  const calculatedChargeINR = selectedService ? Number(((selectedService.sellingRateINR * qty) / 1000).toFixed(2)) : 0;

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

  const handleQuickOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedService || !link || !qty) {
      setOrderMsg({ type: 'error', text: 'Please fill out all order fields.' });
      return;
    }

    setOrderLoading(true);
    setOrderMsg(null);

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
        setOrderMsg({ type: 'success', text: `Order #${data.order.id} placed successfully! \u20B9${data.order.chargeINR} deducted.` });
        setOrders([data.order, ...orders]);
        setUser({ ...user, balanceINR: user.balanceINR - data.order.chargeINR, spentINR: user.spentINR + data.order.chargeINR });
        setLink('');
      } else {
        setOrderMsg({ type: 'error', text: data.error || 'Failed to place order.' });
      }
    } catch (err) {
      setOrderMsg({ type: 'error', text: 'Connection error while placing order.' });
    } finally {
      setOrderLoading(false);
    }
  };

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => ['Pending', 'Processing', 'In progress'].includes(o.status)).length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <DashboardNavbar
        user={user}
        onOpenDepositModal={() => setIsDepositOpen(true)}
        onLogout={() => (window.location.href = '/login')}
      />

      <div className="flex flex-1">
        <DashboardSidebar role={user?.role} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          
          {/* Welcome Banner */}
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.username || 'Creator'}! 👋</h1>
                <p className="mt-1 text-sm text-slate-500">Your Indian SMM Panel powered directly by FameProvider API v2 server</p>
              </div>

              <button
                onClick={() => setIsDepositOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Recharge Wallet in ₹</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wallet Balance</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
                ₹{user ? user.balanceINR.toFixed(2) : '0.00'}
              </div>
              <span className="mt-2 block text-xs text-emerald-600 font-semibold">● Instant PhonePe / Paytm / UPI</span>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Spent</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
                ₹{user ? user.spentINR.toFixed(2) : '0.00'}
              </div>
              <span className="mt-2 block text-xs text-blue-600 font-semibold">Total spent across all orders</span>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Orders</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
                {pendingOrdersCount}
              </div>
              <span className="mt-2 block text-xs text-amber-600 font-semibold">Processing / In Progress</span>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Orders</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
                {completedOrdersCount} / {totalOrdersCount}
              </div>
              <span className="mt-2 block text-xs text-purple-600 font-semibold">100% Non-Drop Guaranteed</span>
            </div>
          </div>

          {/* Quick Order Widget & Recent Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Quick Order Widget */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Place Quick Order</h2>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 border border-blue-100">
                    INR (₹)
                  </span>
                </div>

                {orderMsg && (
                  <div
                    className={`mb-5 rounded-2xl p-4 text-xs font-medium border ${
                      orderMsg.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    {orderMsg.text}
                  </div>
                )}

                <form onSubmit={handleQuickOrderSubmit} className="space-y-5">
                  
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
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

                  {/* Service Details Preview */}
                  {selectedService && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs space-y-2 text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Rate per 1,000:</span>
                        <span className="font-bold text-emerald-600">₹{selectedService.sellingRateINR.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Min / Max Quantity:</span>
                        <span className="font-semibold text-slate-800">{selectedService.minQuantity.toLocaleString()} / {selectedService.maxQuantity.toLocaleString()}</span>
                      </div>
                      <p className="whitespace-pre-line text-[11px] text-slate-500 border-t border-slate-200 pt-2 mt-1 leading-relaxed">
                        {selectedService.description}
                      </p>
                    </div>
                  )}

                  {/* Link */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Link / URL</label>
                    <input
                      type="url"
                      required
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://instagram.com/p/your_post_url"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
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

                  {/* Calculated Charge */}
                  <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-100 p-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Charge:</span>
                    <span className="text-xl font-bold text-blue-600 font-mono">₹{calculatedChargeINR.toFixed(2)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={orderLoading || !selectedService}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 text-sm"
                  >
                    {orderLoading ? 'Processing Order...' : `Place Order Now (₹${calculatedChargeINR.toFixed(2)})`}
                  </button>

                </form>
              </div>
            </div>

            {/* Recent Orders List & Platform Feature */}
            <div className="lg:col-span-5 space-y-6 flex flex-col">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Recent Orders</h3>
                    <Link href="/dashboard/orders" className="text-xs font-bold text-blue-600 hover:underline">
                      View All
                    </Link>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400">No orders placed yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((ord) => (
                        <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-800">#{ord.id}</span>
                            <span
                              className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                                ord.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'In progress' || ord.status === 'Processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-slate-600 font-medium truncate">{ord.serviceName}</p>
                          <div className="flex justify-between items-center text-[11px] pt-1.5 text-slate-500 border-t border-slate-200/80">
                            <span>Qty: {ord.quantity.toLocaleString()}</span>
                            <span className="font-bold text-slate-900">₹{ord.chargeINR.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <span>FameProvider API Status:</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    High Speed API
                  </span>
                </div>
              </div>

              {/* Sleek Dark Feature Card from Sleek Interface Theme */}
              <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative border border-slate-800 shadow-sm">
                <div className="relative z-10">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Live System Info</h4>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">FameProvider v2 API Engine</p>
                      <p className="text-xs text-slate-400 mt-1">Automatic Refill & Non-Drop Syncing</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold text-sm">ACTIVE</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
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
        }}
      />
    </div>
  );
}
