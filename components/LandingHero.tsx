'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Lock, Eye, EyeOff, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface LandingHeroProps {
  onLoginSuccess?: (user: unknown) => void;
}

export default function LandingHero({ onLoginSuccess }: LandingHeroProps) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError('Please enter your username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username }),
      });

      const data = await res.json();
      if (data.user) {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        } else {
          router.push(data.user.role === 'super_admin' ? '/admin' : '/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'user' | 'admin') => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'demo_login', role }),
      });

      const data = await res.json();
      if (data.user) {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        } else {
          router.push(role === 'admin' ? '/admin' : '/dashboard');
        }
      }
    } catch (err) {
      setError('Quick demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 py-12 md:py-20">
      {/* Background Glow Accents */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Zap className="h-3.5 w-3.5 fill-blue-400 text-blue-400" />
              <span>India&apos;s #1 FameProvider SMM Supplier</span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                1M+ creators
              </span>{' '}
              grow their social media with MyFame
            </h1>

            <p className="mt-5 text-base text-slate-300 sm:text-lg max-w-2xl leading-relaxed">
              Creators and entrepreneurs just like you use MyFame automation to boost their engagement, acquire genuine Instagram followers, YouTube views, and Telegram members every single day with 100% non-drop guarantee.
            </p>

            {/* CTA Button Group & Creators Cloud */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <button
                onClick={() => handleQuickDemoLogin('user')}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-500"
              >
                <span>START GROWING NOW</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Creator Avatars Badge */}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-2.5 backdrop-blur-sm">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://picsum.photos/seed/user1/100/100" alt="Creator" referrerPolicy="no-referrer" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://picsum.photos/seed/user2/100/100" alt="Creator" referrerPolicy="no-referrer" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://picsum.photos/seed/user3/100/100" alt="Creator" referrerPolicy="no-referrer" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://picsum.photos/seed/user4/100/100" alt="Creator" referrerPolicy="no-referrer" />
                </div>
                <div className="text-xs">
                  <span className="block font-bold text-white">Loved by 1M+</span>
                  <span className="text-slate-400">active creators</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Selector Chips */}
            <div className="mt-8 border-t border-slate-800/80 pt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                ⚡ Instant One-Click Demo Access
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => handleQuickDemoLogin('user')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-500/20"
                >
                  <User className="h-3.5 w-3.5" />
                  Demo User Panel (Customer)
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-500/20"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                  Demo Admin Panel (Full Owner Control)
                </button>
              </div>
            </div>
          </div>

          {/* Right Card: Quick Sign In Box */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-blue-500/10 backdrop-blur-xl sm:p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">FameProvider Sign In</h3>
                <p className="mt-1 text-xs text-slate-400">Access your SMM wallet, services & order stats in ₹</p>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username (e.g., rajat_creator or admin)"
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <a href="#" className="text-[11px] text-blue-400 hover:underline">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2.5 pl-9 pr-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In to Panel'}
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('user')}
                  className="font-semibold text-blue-400 hover:underline"
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
