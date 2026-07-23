'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqsData = [
  {
    question: 'How to Register on FameProvider?',
    answer: 'To register on FameProvider, click the "Register" or "Sign Up" button, enter your preferred username and email address, and your account will be activated immediately with instant access to your SMM wallet.',
  },
  {
    question: 'How to Place an Order?',
    answer: 'Choose the service you need (e.g. Instagram Followers or Reel Views), paste your public link or username, select the desired quantity, and click Place Order. FameProvider API processes it automatically.',
  },
  {
    question: 'How Can FameProvider Help You Make Money?',
    answer: 'FameProvider offers wholesale supplier pricing in Indian Rupees (₹). You can resell social media services to your clients or local businesses at your own custom profit margins.',
  },
  {
    question: 'Which Indian Payment Gateways are Supported?',
    answer: 'We support all major Indian payment methods including PhonePe Payment Gateway, Paytm Auto-Pay & QR Scan, Razorpay, Cashfree, Easebuzz, PayU, and BHIM UPI with zero gateway fees.',
  },
  {
    question: 'Is FameProvider Safe & Anonymous?',
    answer: 'Yes! We never ask for your account password or sensitive login credentials. All orders are processed safely and anonymously via automated FameProvider API servers.',
  },
  {
    question: 'Is there a Refill Guarantee for Dropped Followers?',
    answer: 'Services tagged with Refill (e.g., 30 Days Refill Guarantee) feature an automated 1-click Refill button in your Order History if drop occurs.',
  },
];

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="border-t border-slate-900 bg-slate-950 py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
            <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-2 text-xs text-slate-400">Everything you need to know about FameProvider SMM services and wallet payments.</p>
        </div>

        <div className="mt-10 space-y-3">
          {faqsData.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition-colors hover:border-slate-700"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-blue-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-slate-800/80 px-5 py-4 text-xs text-slate-300 leading-relaxed bg-slate-950/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
