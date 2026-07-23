'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Sparkles, User, UserPlus, LogIn, ShieldAlert } from 'lucide-react';
import LandingVideoModal from './LandingVideoModal';

interface LandingHeaderProps {
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
}

export default function LandingHeader({ onOpenAuthModal }: LandingHeaderProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 shadow-lg shadow-blue-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                FAME<span className="text-blue-500">PROVIDER</span>
              </span>
              <span className="ml-2 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                Main SMM Supplier
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
              Why Us
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
              How it Works
            </Link>

            <Link href="#platforms" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
              Platforms
            </Link>
            <Link href="#faqs" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
              FAQ
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsVideoOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300 transition-all hover:bg-blue-500/20 hover:text-white"
            >
              <Play className="h-3.5 w-3.5 fill-blue-400" />
              Watch Demo
            </button>

            <button
              onClick={() => onOpenAuthModal ? onOpenAuthModal('login') : null}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-all hover:bg-slate-800 hover:text-white"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </button>

            <button
              onClick={() => onOpenAuthModal ? onOpenAuthModal('signup') : null}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Register
            </button>
          </div>
        </div>
      </header>

      <LandingVideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </>
  );
}
