'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import IndianPaymentModal from '@/components/IndianPaymentModal';
import { Code2, Copy, CheckCircle2, Key, Server, Terminal } from 'lucide-react';
import { User } from '@/lib/types';

export default function ApiDocsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username: 'rajat_creator' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const copyKey = () => {
    if (user?.apiKey) {
      navigator.clipboard.writeText(user.apiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const phpSnippet = `<?php
// PHP SMM API v2 Example
$url = "https://fameprovider.com/api/v2";
$post = [
    'key' => '${user?.apiKey || 'YOUR_API_KEY'}',
    'action' => 'add',
    'service' => 101,
    'link' => 'https://instagram.com/your_profile',
    'quantity' => 1000
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar
        user={user}
        onOpenDepositModal={() => setIsDepositOpen(true)}
        onLogout={() => (window.location.href = '/login')}
      />

      <div className="flex flex-1">
        <DashboardSidebar role={user?.role} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Reseller API v2 Documentation</h1>
            <p className="mt-1 text-xs text-slate-400">Connect your own child panel or external system directly via FameProvider API</p>
          </div>

          {/* API Key Box */}
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Key className="h-5 w-5 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Your Secret API Key</h2>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={user?.apiKey || 'fame_key_loading...'}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs font-mono text-emerald-400 select-all focus:outline-none"
              />
              <button
                onClick={copyKey}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white hover:bg-blue-500"
              >
                {copiedKey ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
              </button>
            </div>
          </div>

          {/* Endpoints & Code Snippets */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-sm font-bold text-white mb-2">HTTP POST Endpoint</h3>
              <div className="rounded-xl bg-slate-950 p-3 font-mono text-xs text-blue-400 border border-slate-800">
                POST /api/v2
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-sm font-bold text-white mb-3">PHP Code Example</h3>
              <pre className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed">
                {phpSnippet}
              </pre>
            </div>
          </div>
        </main>
      </div>

      <IndianPaymentModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        userId={user?.id || 'usr_demo_002'}
        onPaymentSuccess={(newBal) => {
          if (user) setUser({ ...user, balanceINR: newBal });
        }}
      />
    </div>
  );
}
