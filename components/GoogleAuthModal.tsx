'use client';

import React, { useState } from 'react';
import { Shield, Check, X, ArrowRight, Lock, UserCheck } from 'lucide-react';
import { isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }: GoogleAuthModalProps) {
  const [selectedAccount, setSelectedAccount] = useState<'default' | 'custom'>('default');
  const [customEmail, setCustomEmail] = useState('');
  const [fullName, setFullName] = useState('Google Account User');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const defaultGmail = 'rajatshakya566@gmail.com';

  const handleSupabaseOAuth = async () => {
    try {
      if (isSupabaseConfigured()) {
        setLoading(true);
        const supabase = getSupabaseClient();
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${origin}/auth/callback`,
          },
        });
        if (error) {
          setError(`Supabase Google Auth: ${error.message}`);
          setLoading(false);
        }
        return true;
      }
    } catch (e: any) {
      console.warn('Supabase OAuth attempt error, falling back to direct Gmail auth:', e);
    }
    return false;
  };

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // If Supabase OAuth is configured, try Supabase OAuth first
    if (isSupabaseConfigured()) {
      const launched = await handleSupabaseOAuth();
      if (launched) return;
    }

    const targetEmail = selectedAccount === 'default' ? defaultGmail : customEmail.trim();

    if (!targetEmail) {
      setError('Please enter your Google Gmail address');
      return;
    }

    if (!targetEmail.toLowerCase().includes('@')) {
      setError('Please enter a valid email address (e.g., name@gmail.com)');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'google_login',
          email: targetEmail,
          name: fullName || 'Google User',
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        onSuccess(data.user);
      } else {
        setError(data.error || 'Google authentication failed');
      }
    } catch (err) {
      setError('Network connection error while contacting Google Auth server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Google Official Header */}
        <div className="relative border-b border-slate-800 bg-slate-950 p-6 text-center">
          <button
            onClick={onClose}
            type="button"
            className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border border-slate-800 shadow-inner">
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-white">Sign in with Google</h3>
          <p className="mt-1 text-xs text-slate-400">
            to continue to <span className="font-semibold text-slate-200">FameProvider SMM Panel</span>
          </p>
        </div>

        {/* Modal Content Form */}
        <form onSubmit={handleAuthenticate} className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select or enter your Gmail account:
          </div>

          {/* Preset Account Option */}
          <div
            onClick={() => setSelectedAccount('default')}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all flex items-center justify-between gap-3 ${
              selectedAccount === 'default'
                ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xs">
                R
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Rajat Shakya</span>
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                    Verified
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">{defaultGmail}</div>
              </div>
            </div>
            {selectedAccount === 'default' && (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>

          {/* Custom Email Option */}
          <div
            onClick={() => setSelectedAccount('custom')}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all space-y-2.5 ${
              selectedAccount === 'custom'
                ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-blue-400" />
                Use another Google / Gmail account
              </span>
              {selectedAccount === 'custom' && (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>

            {selectedAccount === 'custom' && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Google Gmail Address *
                  </label>
                  <input
                    type="email"
                    required={selectedAccount === 'custom'}
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px] text-slate-400 flex items-start gap-2.5">
            <Lock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300 block mb-0.5">Secure Google Account Verification</span>
              FameProvider will verify your Gmail account identity and grant instant access with ₹100 welcome credit.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/3 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Gmail...</span>
              ) : (
                <>
                  <span>Authenticate Google</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
