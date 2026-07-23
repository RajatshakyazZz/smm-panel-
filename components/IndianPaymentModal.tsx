'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, QrCode, ArrowRight, Wallet, AlertCircle } from 'lucide-react';

interface IndianPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onPaymentSuccess: (newBalanceINR: number) => void;
}

const indianGateways = [
  {
    code: 'phonepe',
    name: 'PhonePe Payment Gateway',
    title: 'PhonePe Instant UPI / QR / NetBanking',
    icon: '⚡',
    badge: 'Popular',
    color: 'from-purple-600 to-indigo-600',
  },
  {
    code: 'razorpay',
    name: 'Razorpay',
    title: 'Razorpay Cards, UPI & NetBanking',
    icon: '💳',
    badge: 'Instant',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    code: 'paytm',
    name: 'Paytm UPI QR Auto Pay',
    title: 'Paytm QR Code & Wallet',
    icon: '📲',
    badge: '0% Fee',
    color: 'from-sky-500 to-blue-700',
  },
  {
    code: 'cashfree',
    name: 'Cashfree Payments',
    title: 'Cashfree Banking & NetBanking',
    icon: '🏦',
    badge: 'Verified',
    color: 'from-emerald-600 to-teal-700',
  },
  {
    code: 'easebuzz',
    name: 'Easebuzz Gateway',
    title: 'Easebuzz UPI Gateway',
    icon: '🔥',
    badge: 'Fast',
    color: 'from-amber-600 to-orange-600',
  },
];

export default function IndianPaymentModal({
  isOpen,
  onClose,
  userId,
  onPaymentSuccess,
}: IndianPaymentModalProps) {
  const [selectedGateway, setSelectedGateway] = useState('phonepe');
  const [amountINR, setAmountINR] = useState('500');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'qr' | 'success'>('form');
  const [error, setError] = useState('');
  const [transactionRef, setTransactionRef] = useState('');

  if (!isOpen) return null;

  const handleProceedPayment = async () => {
    const amt = parseFloat(amountINR);
    if (isNaN(amt) || amt < 10) {
      setError('Minimum deposit amount is \u20B910');
      return;
    }

    setError('');
    setStep('qr');
  };

  const handleSimulatePaymentConfirmation = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gatewayCode: selectedGateway,
          amountINR: parseFloat(amountINR),
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setTransactionRef(data.transaction.transactionRef);
        setStep('success');
        onPaymentSuccess(data.user.balanceINR);
      } else {
        setError(data.error || 'Payment failed to process');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setStep('form');
    setError('');
    onClose();
  };

  const currentGw = indianGateways.find((g) => g.code === selectedGateway) || indianGateways[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={handleCloseAndReset}
          className="absolute right-4 top-4 rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* STEP 1: SELECT GATEWAY & AMOUNT */}
        {step === 'form' && (
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add Funds in Indian Rupees (\u20B9)</h3>
                <p className="text-xs text-slate-400">Official Indian payment gateways with zero fee</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Gateway Grid */}
            <div className="mb-5 space-y-2.5">
              <label className="block text-xs font-semibold text-slate-300">Select Gateway</label>
              <div className="grid grid-cols-1 gap-2.5">
                {indianGateways.map((gw) => (
                  <button
                    key={gw.code}
                    type="button"
                    onClick={() => setSelectedGateway(gw.code)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                      selectedGateway === gw.code
                        ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{gw.icon}</span>
                      <div>
                        <span className="block text-xs font-bold text-white">{gw.name}</span>
                        <span className="text-[11px] text-slate-400">{gw.title}</span>
                      </div>
                    </div>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      {gw.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Amount Selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Amount in INR (\u20B9)</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {['100', '250', '500', '1000'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmountINR(val)}
                    className={`rounded-lg border py-2 text-xs font-bold transition-colors ${
                      amountINR === val
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    \u20B9{val}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">\u20B9</span>
                <input
                  type="number"
                  min="10"
                  max="100000"
                  value={amountINR}
                  onChange={(e) => setAmountINR(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-8 pr-4 text-sm font-bold text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter custom amount"
                />
              </div>
            </div>

            <button
              onClick={handleProceedPayment}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500"
            >
              <span>Proceed to Pay \u20B9{amountINR}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STEP 2: SIMULATED UPI QR SCANNER */}
        {step === 'qr' && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 mb-4">
              <QrCode className="h-3.5 w-3.5" />
              <span>{currentGw.name} Instant UPI Portal</span>
            </div>

            <h3 className="text-lg font-bold text-white">Scan & Pay \u20B9{amountINR}</h3>
            <p className="mt-1 text-xs text-slate-400">Open PhonePe, Google Pay, Paytm or BHIM UPI app to scan</p>

            {/* Simulated QR Box */}
            <div className="my-6 mx-auto flex h-48 w-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-500/40 bg-slate-950 p-4 shadow-inner">
              <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-white p-2">
                {/* SVG Mock QR Code */}
                <svg viewBox="0 0 100 100" className="h-full w-full fill-slate-900">
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  <rect x="80" y="10" width="10" height="10" />
                  <rect x="10" y="80" width="10" height="10" />
                  <rect x="40" y="10" width="20" height="10" />
                  <rect x="10" y="40" width="10" height="20" />
                  <rect x="40" y="40" width="20" height="20" />
                  <rect x="70" y="40" width="20" height="10" />
                  <rect x="40" y="70" width="10" height="20" />
                  <rect x="60" y="70" width="30" height="20" />
                </svg>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs mb-6">
              <span className="text-slate-400 block">UPI ID for Manual Transfer:</span>
              <span className="font-mono font-bold text-blue-400 select-all">fameprovider.paytm@upi</span>
            </div>

            {error && (
              <div className="mb-4 text-xs text-red-400">{error}</div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-1/2 rounded-xl border border-slate-800 bg-slate-950 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Change Gateway
              </button>
              <button
                type="button"
                onClick={handleSimulatePaymentConfirmation}
                disabled={loading}
                className="w-1/2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50"
              >
                {loading ? 'Verifying UPI...' : 'Simulate Paid \u20B9' + amountINR}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-extrabold text-white">Wallet Deposit Successful!</h3>
            <p className="mt-1 text-xs text-slate-300">
              \u20B9{amountINR} has been credited to your SMM panel balance.
            </p>

            <div className="my-5 rounded-xl border border-slate-800 bg-slate-950 p-4 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Transaction Ref:</span>
                <span className="font-mono font-bold text-white">{transactionRef}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Gateway:</span>
                <span className="font-semibold text-blue-400">{currentGw.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="font-bold text-emerald-400">SUCCESS</span>
              </div>
            </div>

            <button
              onClick={handleCloseAndReset}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
            >
              Done & Start Placing Orders
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
