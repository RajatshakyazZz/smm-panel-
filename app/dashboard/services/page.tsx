'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import IndianPaymentModal from '@/components/IndianPaymentModal';
import { Grid, Search, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';
import { User, SMMCategory, SMMService } from '@/lib/types';

export default function ServicesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<SMMCategory[]>([]);
  const [services, setServices] = useState<SMMService[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
        if (data.services) setServices(data.services);
      });
  }, []);

  const filteredServices = services.filter((srv) => {
    const matchesCategory = activeCategory === 'all' || srv.category === activeCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(srv.providerServiceId).includes(searchQuery) ||
      srv.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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
          <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Services List & Wholesale Rates (₹)</h1>
              <p className="mt-1 text-xs text-slate-500">All prices per 1,000 quantity in Indian Rupees (₹)</p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services or ID..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs font-medium"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Services ({services.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  activeCategory === cat.name
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Service Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-5">ID</th>
                    <th className="py-4 px-5">Service Name</th>
                    <th className="py-4 px-5">Rate / 1000 (₹)</th>
                    <th className="py-4 px-5">Min / Max</th>
                    <th className="py-4 px-5">Refill Guarantee</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No matching services found.
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((srv) => (
                      <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5 font-mono font-bold text-slate-700">#{srv.providerServiceId}</td>
                        <td className="py-4 px-5 max-w-md">
                          <span className="font-bold text-slate-900 block">{srv.name}</span>
                          <span className="text-[10px] font-semibold text-slate-400 block mt-0.5 uppercase tracking-wider">{srv.category}</span>
                        </td>
                        <td className="py-4 px-5 font-mono font-bold text-emerald-600 text-sm">
                          ₹{srv.sellingRateINR.toFixed(2)}
                        </td>
                        <td className="py-4 px-5 text-slate-600 font-medium">
                          {srv.minQuantity.toLocaleString()} / {srv.maxQuantity.toLocaleString()}
                        </td>
                        <td className="py-4 px-5">
                          {srv.refillSupported ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                              <RefreshCw className="h-3 w-3" />
                              Refill Available
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">No Refill</span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <a
                            href="/dashboard/new-order"
                            className="inline-flex items-center rounded-xl bg-blue-50 border border-blue-200 px-3.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                          >
                            Order
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
