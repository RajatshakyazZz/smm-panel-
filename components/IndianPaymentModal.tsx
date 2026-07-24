'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, QrCode, Wallet, AlertCircle, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { PaymentGatewayConfig } from '@/lib/types';

interface IndianPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onPaymentSuccess: (newBalanceINR: number) => void;
}

export default function IndianPaymentModal({
  isOpen,
  onClose,
  userId,
  onPaymentSuccess,
}: IndianPaymentModalProps) {
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [selectedGateway, setSelectedGateway] = useState('personal_upi');
  const [amountINR, setAmountINR] = useState('500');
  const [utrInput, setUtrInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'qr' | 'success'>('form');
  const [error, setError] = useState('');
  const [transactionRef, setTransactionRef] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/wallet')
        .then((res) => res.json())
        .then((data) => {
          if (data.gateways && Array.isArray(data.gateways)) {
            const active = data.gateways.filter((g: PaymentGatewayConfig) => g.enabled);
            setGateways(active);
            if (active.length > 0) {
              const hasPersonal = active.find((g: PaymentGatewayConfig) => g.code === 'personal_upi');
              setSelectedGateway(hasPersonal ? 'personal_upi' : active[0].code);
            }
          }
        })
        .catch((err) => console.error('Error fetching gateways:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentGw = gateways.find((g) => g.code === selectedGateway) || gateways[0] || {
    code: 'personal_upi',
    name: 'Personal UPI QR & Direct Bank',
    upiId: '9876543210@paytm',
    upiName: 'SMM Panel Direct Wallet',
    qrImageUrl: '',
    minAmountINR: 10,
    maxAmountINR: 100000,
  };

  const activeUpiId = currentGw.upiId || '9876543210@paytm';
  const activeUpiName = currentGw.upiName || 'SMM Panel';
  const amountNumber = parseFloat(amountINR) || 0;

  const qrCodeUrl =
    currentGw.qrImageUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activeUpiName)}&am=${amountNumber}&cu=INR`
    )}&size=250x250`;

  const upiDeepLink = `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activeUpiName)}&am=${amountNumber}&cu=INR`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(activeUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedPayment = () => {
    const amt = parseFloat(amountINR);
    if (isNaN(amt) || amt < (currentGw.minAmountINR || 10)) {
      setError(`Minimum deposit amount is ₹${currentGw.minAmountINR || 10}`);
      return;
    }

    setError('');
    setStep('qr');
  };

  const handleConfirmUtrPayment = async () => {
    setLoading(true);
    setError('');

    const cleanUtr = utrInput.trim();

    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gatewayCode: selectedGateway,
          amountINR: parseFloat(amountINR),
          utr: cleanUtr || ('UTR_' + Date.now().toString().slice(-8)),
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setTransactionRef(data.transaction.transactionRef);
        setStep('success');
        onPaymentSuccess(data.user.balanceINR);
      } else {
        setError(data.error || 'Payment verification failed');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setStep('form');
    setUtrInput('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
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
                <h3 className="text-lg font-bold text-white">Add Funds in Wallet (₹ INR)</h3>
                <p className="text-xs text-slate-400">Direct Personal UPI QR Code & Bank Deposit</p>
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
              <label className="block text-xs font-semibold text-slate-300">Select Payment Method</label>
              <div className="grid grid-cols-1 gap-2.5">
                {gateways.map((gw) => {
                  const isPersonal = gw.code === 'personal_upi';
                  return (
                    <button
                      key={gw.code}
                      type="button"
                      onClick={() => setSelectedGateway(gw.code)}
                      className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                        selectedGateway === gw.code
                          ? isPersonal
                            ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500 shadow-lg shadow-amber-500/10'
                            : 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{isPersonal ? '⚡' : '💳'}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="block text-xs font-extrabold text-white">{gw.name}</span>
                            {isPersonal && <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {isPersonal ? `Personal QR / UPI ID: ${gw.upiId || 'Direct Bank'}` : gw.title || 'Instant Payment Gateway'}
                          </span>
                        </div>
                      </div>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        isPersonal ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {isPersonal ? '0% Fee - Direct' : 'Instant'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Amount Selector */}
            <div className="mb-5 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Select Amount to Add (₹)</label>
              <div className="grid grid-cols-4 gap-2">
                {['100', '200', '500', '1000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountINR(amt)}
                    className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                      amountINR === amt
                        ? 'border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Or Enter Custom Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-sm font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={amountINR}
                  onChange={(e) => setAmountINR(e.target.value)}
                  placeholder="Enter deposit amount"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-8 pr-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedPayment}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 flex items-center justify-center gap-2"
            >
              <span>Proceed to Pay ₹{amountINR || '0'}</span>
            </button>
          </div>
        )}

        {/* STEP 2: PERSONAL UPI QR SCANNER & UTR SUBMISSION */}
        {step === 'qr' && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 mb-3">
              <QrCode className="h-3.5 w-3.5" />
              <span>{currentGw.name}</span>
            </div>

            <h3 className="text-lg font-black text-white">Scan & Pay ₹{amountINR}</h3>
            <p className="mt-1 text-xs text-slate-300">Scan using PhonePe, Google Pay, Paytm or any UPI App</p>

            {/* Dynamic QR Code Box */}
            <div className="my-5 mx-auto flex h-52 w-52 flex-col items-center justify-center rounded-2xl border-2 border-amber-500/40 bg-white p-3 shadow-2xl relative group">
              <img
                src={qrCodeUrl}
                alt="Personal UPI QR Code"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Copyable UPI ID Box */}
            <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 text-xs mb-4 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Personal UPI ID:</span>
                  <span className="font-mono font-black text-amber-300 text-sm">{activeUpiId}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Name: {activeUpiName}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy UPI'}</span>
                </button>
              </div>
            </div>

            {/* Direct Mobile UPI Link Button */}
            <div className="mb-5">
              <a
                href={upiDeepLink}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                <span>Open in UPI App (PhonePe / GPay / Paytm)</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* 12-Digit UTR Input Field */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-left mb-5 space-y-2">
              <label className="block text-xs font-bold text-slate-200">
                Enter 12-Digit Transaction UTR / Ref No.
              </label>
              <input
                type="text"
                value={utrInput}
                onChange={(e) => setUtrInput(e.target.value)}
                placeholder="e.g. 423812009845"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-slate-400">
                Payment karne ke baad aapke PhonePe/GPay app me 12-digit UTR/Ref No. dikhega. Yahan enter karke confirm karein.
              </p>
            </div>

            {error && (
              <div className="mb-4 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">{error}</div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-1/3 rounded-xl border border-slate-800 bg-slate-950 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmUtrPayment}
                disabled={loading}
                className="w-2/3 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50"
              >
                {loading ? 'Verifying UTR...' : `Confirm Payment ₹${amountINR}`}
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
              ₹{amountINR} has been credited to your SMM panel balance.
            </p>

            <div className="my-5 rounded-xl border border-slate-800 bg-slate-950 p-4 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Transaction Ref:</span>
                <span className="font-mono font-bold text-white">{transactionRef}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Method:</span>
                <span className="font-semibold text-amber-400">{currentGw.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="font-bold text-emerald-400">SUCCESS & CREDITED</span>
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
