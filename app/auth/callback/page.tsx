'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Authenticating with Google via Supabase...');
  const [error, setError] = useState('');

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        if (isSupabaseConfigured()) {
          const supabase = getSupabaseClient();
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error('Supabase auth session error:', sessionError);
            setError(sessionError.message);
            return;
          }

          if (session?.user?.email) {
            const googleEmail = session.user.email;
            const googleName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Google User';

            // Sync with backend local DB
            const res = await fetch('/api/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'google_login',
                email: googleEmail,
                name: googleName,
              }),
            });

            const data = await res.json();
            if (data.success && data.user) {
              localStorage.setItem('smm_user', JSON.stringify(data.user));
              setStatus('Google Authentication Successful! Redirecting to Dashboard...');
              setTimeout(() => {
                if (data.user.role === 'super_admin') {
                  router.push('/admin');
                } else {
                  router.push('/dashboard');
                }
              }, 800);
              return;
            }
          }
        }

        // Fallback or check localStorage
        const storedUser = localStorage.getItem('smm_user');
        if (storedUser) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      } catch (err: any) {
        console.error('Callback handling error:', err);
        setError('Failed to complete Google authentication. Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      }
    }

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl flex flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <Sparkles className="h-7 w-7 animate-pulse" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Google Authentication</h2>

        {error ? (
          <div className="mt-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400">
            {error}
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span>{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}
