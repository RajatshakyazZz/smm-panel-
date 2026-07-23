'use client';

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { LifeBuoy, Send } from 'lucide-react';
import { SupportTicket, User } from '@/lib/types';

export default function AdminTicketsPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTickets = () => {
    fetch('/api/tickets')
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
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username: 'admin' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setAdminUser(data.user);
      });

    fetchTickets();
  }, []);

  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser || !selectedTicketId || !replyMsg.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          ticketId: selectedTicketId,
          senderId: adminUser.id,
          message: replyMsg,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchTickets();
        setReplyMsg('');
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
      <DashboardNavbar user={adminUser} onLogout={() => (window.location.href = '/login')} />

      <div className="flex flex-1">
        <DashboardSidebar role="super_admin" isAdminNav={true} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Admin Support Ticket Desk</h1>
            <p className="mt-1 text-xs text-slate-400">Respond to customer support tickets and handle refill requests</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">All Customer Tickets</h2>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {tickets.map((tkt) => (
                  <button
                    key={tkt.id}
                    onClick={() => setSelectedTicketId(tkt.id)}
                    className={`w-full text-left rounded-xl p-3 text-xs transition-all border ${
                      selectedTicketId === tkt.id
                        ? 'bg-purple-950/40 border-purple-500/40 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between font-bold mb-1">
                      <span>{tkt.username}</span>
                      <span className="text-purple-400">{tkt.status}</span>
                    </div>
                    <p className="truncate font-medium text-slate-200">{tkt.subject}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl flex flex-col justify-between">
              {activeTicket ? (
                <div>
                  <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-sm">{activeTicket.subject}</h3>
                      <p className="text-xs text-slate-400">Customer: {activeTicket.username}</p>
                    </div>
                    <span className="rounded bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-400 border border-purple-500/20">
                      {activeTicket.status}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {activeTicket.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-xl p-3.5 text-xs ${
                          m.senderRole === 'super_admin'
                            ? 'bg-purple-950/40 border border-purple-500/30 text-slate-200 ml-6'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 mr-6'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className={m.senderRole === 'super_admin' ? 'text-purple-400' : 'text-blue-400'}>
                            {m.senderName} ({m.senderRole})
                          </span>
                        </div>
                        <p className="whitespace-pre-line leading-relaxed">{m.message}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAdminReply} className="mt-6 border-t border-slate-800 pt-4 flex gap-2">
                    <input
                      type="text"
                      required
                      value={replyMsg}
                      onChange={(e) => setReplyMsg(e.target.value)}
                      placeholder="Type admin official reply..."
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-50"
                    >
                      Reply
                    </button>
                  </form>
                </div>
              ) : (
                <div className="py-20 text-center text-xs text-slate-500">Select a ticket from the left column.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
