'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, UserPlus, LogIn } from 'lucide-react';

interface LandingHeaderProps {
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
}

export default function LandingHeader({ onOpenAuthModal }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-102">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-white">
              FAME<span className="text-blue-500">PROVIDER</span>
            </span>
            <span className="hidden sm:inline-block rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
              Main Supplier
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-xs font-semibold text-slate-300 transition-colors hover:text-white">
            Why Us
          </Link>
          <Link href="#services" className="text-xs font-semibold text-slate-300 transition-colors hover:text-white">
            Services & Rates
          </Link>
          <Link href="#faqs" className="text-xs font-semibold text-slate-300 transition-colors hover:text-white">
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenAuthModal ? onOpenAuthModal('login') : null}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white"
          >
            <LogIn className="h-3.5 w-3.5" />
            Sign in
          </button>

          <button
            onClick={() => onOpenAuthModal ? onOpenAuthModal('signup') : null}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-500"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Register
          </button>
        </div>
      </div>
    </header>
  );
}

