'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, CheckCircle2, Zap, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface ServiceItem {
  id: string;
  providerServiceId: number;
  name: string;
  category: string;
  sellingRateINR: number;
  minQuantity: number;
  maxQuantity: number;
  refillSupported: boolean;
  cancelSupported: boolean;
  description?: string;
}

export default function LandingServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setServices(data);
            const cats = Array.from(new Set(data.map((s: ServiceItem) => s.category))) as string[];
            setCategories(cats);
          }
        }
      } catch (err) {
        console.error('Failed to load services on landing page', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.providerServiceId).includes(searchQuery) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="services" className="relative border-t border-slate-900 bg-slate-950/60 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Official FameProvider API Services List</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Explore All <span className="text-blue-500">FameProvider Services</span>
          </h2>
          <p className="mt-2 max-w-2xl text-xs text-slate-400 sm:text-sm">
            Direct main provider rates in Indian Rupees (₹) with instant start speeds, 100% non-drop quality, and automatic 1-click refill buttons.
          </p>
        </div>

        {/* Controls: Category Filter & Search */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none max-w-full">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              All Services ({services.length})
            </button>
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all max-w-[200px] truncate ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
                title={cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search service name or ID..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Select Box for mobile/longer list */}
        {categories.length > 8 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <Filter className="h-3.5 w-3.5 text-blue-400" /> Filter by Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Services Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading FameProvider services...</div>
          ) : filteredServices.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No services found matching your criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5 font-bold">ID</th>
                    <th className="px-4 py-3.5 font-bold">Service Name & Features</th>
                    <th className="px-4 py-3.5 font-bold text-right">Rate / 1,000 (₹)</th>
                    <th className="px-4 py-3.5 font-bold text-center">Min / Max</th>
                    <th className="px-4 py-3.5 font-bold text-center">Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredServices.slice(0, 30).map((service) => (
                    <tr key={service.id} className="transition-colors hover:bg-slate-800/40">
                      <td className="px-4 py-3.5 font-mono text-[11px] font-semibold text-blue-400">
                        #{service.providerServiceId}
                      </td>
                      <td className="px-4 py-3.5 max-w-md">
                        <div className="font-semibold text-white leading-snug">{service.name}</div>
                        <div className="mt-0.5 text-[10px] text-slate-400 font-medium">{service.category}</div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-emerald-400 text-sm whitespace-nowrap">
                        ₹{service.sellingRateINR.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {service.minQuantity.toLocaleString('en-IN')} / {service.maxQuantity >= 100000000 ? 'Unlimited' : service.maxQuantity.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {service.refillSupported && (
                            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                              ♻️ Refill
                            </span>
                          )}
                          {service.cancelSupported && (
                            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                              ⚡ Cancelable
                            </span>
                          )}
                          {!service.refillSupported && !service.cancelSupported && (
                            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                              Instant Start
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredServices.length > 30 && (
                <div className="border-t border-slate-800 bg-slate-950/60 px-4 py-3 text-center text-xs text-slate-400">
                  Showing top 30 of {filteredServices.length} services.{' '}
                  <a href="/login" className="font-semibold text-blue-400 hover:underline inline-flex items-center gap-1">
                    Sign in to search and order all services <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
