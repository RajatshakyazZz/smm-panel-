'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Lock, Eye, EyeOff, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

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
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
              <Zap className="h-3.5 w-3.5" />
              <span>Direct Main SMM Supplier Panel in India</span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              Cheapest & Non-Drop <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                FameProvider SMM Panel
              </span>
            </h1>

            <p className="mt-4 text-sm text-slate-300 sm:text-base max-w-2xl leading-relaxed">
              Boost your Instagram followers, Reel views, YouTube watch-time & Telegram channel members directly from the main API supplier in Indian Rupees (₹).
            </p>

            {/* Key feature points */}
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-lg text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Instant API Order Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Wholesale Rates in INR (₹)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Automated 1-Click Refill</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>PhonePe & Paytm UPI Auto-Pay</span>
              </div>
            </div>
          </div>

          {/* Right Card: Clean Sign In Box */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-blue-500/5 backdrop-blur-xl sm:p-8">
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-white">Sign In to FameProvider</h3>
                <p className="mt-1 text-xs text-slate-400">Access your SMM wallet, services & order history</p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
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
                      placeholder="Enter username"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-9 pr-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In to Panel'}
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/signup')}
                  className="font-semibold text-blue-400 hover:underline"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

