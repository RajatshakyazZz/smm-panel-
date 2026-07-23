'use client';

import React, { useState } from 'react';
import LandingHeader from '@/components/LandingHeader';
import LandingHero from '@/components/LandingHero';
import LandingFeatures from '@/components/LandingFeatures';
import LandingFAQ from '@/components/LandingFAQ';
import FloatingSupportWidgets from '@/components/FloatingSupportWidgets';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleLoginSuccess = (user: any) => {
    if (user.role === 'super_admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <LandingHeader onOpenAuthModal={() => router.push('/login')} />
      <main>
        <LandingHero onLoginSuccess={handleLoginSuccess} />
        <LandingFeatures />
        <LandingFAQ />
      </main>

      {/* Landing Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 FameProvider. All Rights Reserved. Premier Indian SMM Panel.</p>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-slate-300">Why Us</a>
            <a href="#how-it-works" className="hover:text-slate-300">How It Works</a>
            <a href="#faqs" className="hover:text-slate-300">Terms & Privacy</a>
          </div>
        </div>
      </footer>

      <FloatingSupportWidgets />
    </div>
  );
}
