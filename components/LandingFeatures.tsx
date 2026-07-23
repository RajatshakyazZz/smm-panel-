'use client';

import React from 'react';
import {
  Award,
  Clock,
  ShieldCheck,
  CreditCard,
  Zap,
  Repeat,
  Headphones,
  Check
} from 'lucide-react';

export default function LandingFeatures() {
  return (
    <div className="bg-slate-950 text-slate-100">
      
      {/* WHY CHOOSE FAMEPROVIDER */}
      <section id="features" className="relative border-t border-slate-900 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Why Choose <span className="text-blue-500">FameProvider</span>?
            </h2>
            <p className="mt-3 text-xs text-slate-400 sm:text-sm leading-relaxed">
              India&apos;s leading social media reseller platform built directly on FameProvider API infrastructure for ultra-fast execution, zero drop guarantee, and 24/7 reliability.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-blue-500/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Top Quality Accounts</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Real active Indian & international profiles with realistic posts, stories, and natural engagement.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-blue-500/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Seamless UPI Payments</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Add funds instantly in Indian Rupees (₹) via PhonePe, Paytm QR, Razorpay & Easebuzz without hidden fees.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-blue-500/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Instant Order Dispatch</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Direct main supplier integration starts processing orders automatically within 0 to 1 minute.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:border-blue-500/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
                <Repeat className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Automated Refill System</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Enjoy 30-day to lifetime refill guarantees with a simple 1-click refill button in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 EASY STEPS */}
      <section className="relative border-t border-slate-900 bg-slate-900/30 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">How It Works</span>
            <h2 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">Start Growing in 3 Simple Steps</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white mb-4">
                01
              </div>
              <h3 className="text-sm font-bold text-white">Select a Service</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Browse through 170+ official FameProvider services across Instagram, YouTube, Telegram, and Facebook.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-black text-white mb-4">
                02
              </div>
              <h3 className="text-sm font-bold text-white">Enter Link & Quantity</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Provide your public profile or post link and specify the quantity. Password is never required!
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs font-black text-white mb-4">
                03
              </div>
              <h3 className="text-sm font-bold text-white">Watch Real Results</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Sit back and watch your followers, likes, or views increase rapidly with non-drop retention.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
