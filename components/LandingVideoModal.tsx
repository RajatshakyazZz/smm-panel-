'use client';

import React from 'react';
import { X, Play, Sparkles, CheckCircle2 } from 'lucide-react';

interface LandingVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LandingVideoModal({ isOpen, onClose }: LandingVideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-blue-500/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">MyFame SMM Panel Walkthrough & Demo</h3>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 p-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20">
              <Play className="h-8 w-8 fill-blue-400 ml-1" />
            </div>
            <h4 className="text-xl font-bold text-white">Automated Indian SMM Growth Demo</h4>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              Watch how creators and businesses place instant orders with Indian Rupees (₹), automatic FameProvider API synchronization, and 24/7 human support.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-left max-w-lg w-full">
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 border border-slate-800 p-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Instant INR (₹) Wallet Recharge</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 border border-slate-800 p-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>PhonePe / Paytm / Razorpay UPI</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 border border-slate-800 p-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Direct FameProvider API v2 Route</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 border border-slate-800 p-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Non-Drop Guarantee & Auto Refill</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            Close Demo
          </button>
        </div>
      </div>
    </div>
  );
}
