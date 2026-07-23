'use client';

import React from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function FloatingSupportWidgets() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Telegram Help Floating Button */}
      <a
        href="https://telegram.me/Fameprovider_help"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-13 w-13 items-center justify-center rounded-full bg-sky-500 text-white shadow-xl shadow-sky-500/30 transition-all hover:scale-110 hover:bg-sky-400 focus:outline-none"
        title="Telegram Direct Human Support"
      >
        <Send className="h-6 w-6 transition-transform group-hover:rotate-12" />
        <span className="absolute right-14 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100 border border-slate-800">
          Telegram Support (24/7)
        </span>
      </a>

      {/* WhatsApp Support Floating Button */}
      <a
        href="https://api.whatsapp.com/send?phone=7050259916"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-13 w-13 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-110 hover:bg-emerald-400 focus:outline-none"
        title="WhatsApp Support (+91 7050259916)"
      >
        <MessageSquare className="h-6 w-6 transition-transform group-hover:scale-110" />
        <span className="absolute right-14 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100 border border-slate-800">
          WhatsApp (+91 7050259916)
        </span>
      </a>
    </div>
  );
}
