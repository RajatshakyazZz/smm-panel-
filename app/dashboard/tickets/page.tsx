'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import IndianPaymentModal from '@/components/IndianPaymentModal';
import { LifeBuoy, Send, Plus, MessageSquare, Clock, User as UserIcon } from 'lucide-react';
import { User, SupportTicket } from '@/lib/types';

export default function TicketsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchTickets = (userId: string) => {
    fetch(`/api/tickets?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tickets) {
          setTickets(data.tickets);
          if (!selectedTicketId && data.tickets.length > 0) {
            setSelectedTicketId(data.tickets[0].id);
          }
        }
      });
  };

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('smm_user') : null;
    let currentUser: User | null = null;
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
      } catch (e) {}
    }

    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_user', userId: currentUser.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('smm_user', JSON.stringify(data.user));
        } else {
          setUser(currentUser);
        }
      })
      .catch(() => setUser(currentUser));

    fetchTickets(currentUser.id);
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject || !message) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          userId: user.id,
          subject,
          orderId: orderId || undefined,
          message,
        }),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setTickets([data.ticket, ...tickets]);
        setSelectedTicketId(data.ticket.id);
        setSubject('');
        setOrderId('');
        setMessage('');
        setMsg('Support ticket created!');
      }
    } catch (err) {
      setMsg('Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTicketId || !replyMessage.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          ticketId: selectedTicketId,
          senderId: user.id,
          message: replyMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (user) fetchTickets(user.id);
        setReplyMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeTicket = tickets.find((t) => t.id === selectedTicketId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DashboardNavbar
        user={user}
        onOpenDepositModal={() => setIsDepositOpen(true)}
        onLogout={() => (window.location.href = '/login')}
      />

      <div className="flex flex-1">
        <DashboardSidebar role={user?.role} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">24/7 Human Support Desk</h1>
            <p className="mt-1 text-xs text-slate-400">Direct assistance from FameProvider team for refills, speed inquiries, and wallet balance</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Create Ticket Form */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
                  <LifeBuoy className="h-5 w-5 text-blue-400" />
                  <h2 className="text-sm font-bold text-white">Open New Ticket</h2>
                </div>

                {msg && <div className="mb-4 text-xs font-semibold text-emerald-400">{msg}</div>}

                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Refill Request or Speed Query"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Order ID (Optional)</label>
                    <input
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g. ord_9001"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your request in detail..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg hover:bg-blue-500 disabled:opacity-50"
                  >
                    Submit Support Ticket
                  </button>
                </form>
              </div>
            </div>

            {/* Ticket Messages View */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-4 mb-4">
                    Support Conversation Thread
                  </h3>

                  {/* Ticket List Selector */}
                  <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                    {tickets.map((tkt) => (
                      <button
                        key={tkt.id}
                        onClick={() => setSelectedTicketId(tkt.id)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          selectedTicketId === tkt.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        #{tkt.id.slice(-4)} - {tkt.subject.slice(0, 15)}...
                      </button>
                    ))}
                  </div>

                  {activeTicket ? (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{activeTicket.subject}</span>
                          <span className="text-emerald-400 font-normal">{activeTicket.status}</span>
                        </div>
                        {activeTicket.orderId && <p className="text-[11px] text-blue-400">Order Ref: #{activeTicket.orderId}</p>}
                      </div>

                      {activeTicket.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`rounded-xl p-3.5 text-xs ${
                            m.senderRole === 'super_admin'
                              ? 'bg-blue-950/40 border border-blue-500/30 text-slate-200 ml-4'
                              : 'bg-slate-950 border border-slate-800 text-slate-300 mr-4'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span className={m.senderRole === 'super_admin' ? 'text-blue-400' : 'text-emerald-400'}>
                              {m.senderName} ({m.senderRole})
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="whitespace-pre-line leading-relaxed">{m.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-slate-500">No ticket selected.</div>
                  )}
                </div>

                {activeTicket && (
                  <form onSubmit={handleSendReply} className="mt-6 border-t border-slate-800 pt-4 flex gap-2">
                    <input
                      type="text"
                      required
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your message reply..."
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>

      <IndianPaymentModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        userId={user?.id || ''}
        onPaymentSuccess={(newBal) => {
          if (user) {
            const updated = { ...user, balanceINR: newBal };
            setUser(updated);
            localStorage.setItem('smm_user', JSON.stringify(updated));
          }
        }}
      />
    </div>
  );
}
