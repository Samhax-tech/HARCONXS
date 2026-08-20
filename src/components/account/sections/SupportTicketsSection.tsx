import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { SupportTicket } from '../../../types';
import {
  MessageSquare,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  LifeBuoy,
  User,
  Headphones,
  X
} from 'lucide-react';

export const SupportTicketsSection: React.FC = () => {
  const { currentUser, tickets, createTicket, replyToTicket, showToast } = useStore();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New ticket form
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('General');
  const [initialMessage, setInitialMessage] = useState('');

  // Reply state
  const [replyText, setReplyText] = useState('');

  if (!currentUser) return null;

  // Filter tickets strictly for current user
  const userTickets = tickets.filter(t =>
    t.customerId === currentUser.id ||
    (t.customerEmail && t.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  );

  const selectedTicket = userTickets.find(t => t.id === selectedTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMessage.trim()) return;

    createTicket(subject.trim(), category, initialMessage.trim(), currentUser.name, currentUser.email);
    setIsModalOpen(false);
    setSubject('');
    setInitialMessage('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketId) return;

    replyToTicket(selectedTicketId, replyText.trim(), 'customer');
    setReplyText('');
    showToast('Reply dispatched to concierge team.');
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> {status}
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case 'Waiting':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
            <Clock className="w-3 h-3" /> Awaiting Response
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <AlertCircle className="w-3 h-3" /> Open
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Ticket Conversation View */}
      {selectedTicket ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTicketId(null)}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-zinc-400">#{selectedTicket.ticketNumber}</span>
                  <h3 className="text-base font-semibold text-zinc-100">{selectedTicket.subject}</h3>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">Category: {selectedTicket.category}</p>
              </div>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-5 min-h-[350px] max-h-[500px] overflow-y-auto space-y-4">
            {selectedTicket.messages.map((msg, i) => {
              const isCustomer = msg.sender === 'customer';
              return (
                <div key={i} className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                      {isCustomer ? <User className="w-3 h-3" /> : <Headphones className="w-3 h-3 text-amber-400" />}
                      {msg.senderName}
                    </span>
                    <span className="text-[9px] text-zinc-600">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                      isCustomer
                        ? 'bg-amber-500 text-zinc-950 rounded-tr-none font-medium'
                        : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700/60'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Box */}
          {selectedTicket.status !== 'Closed' ? (
            <form onSubmit={handleSendReply} className="flex gap-2">
              <input
                type="text"
                placeholder="Type your reply to concierge..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold disabled:opacity-50 text-xs flex items-center gap-1.5 transition"
              >
                <Send className="w-4 h-4" /> Reply
              </button>
            </form>
          ) : (
            <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-center text-xs text-zinc-500">
              This ticket has been marked as closed. Open a new ticket if you require further assistance.
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Header & Create Ticket Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-amber-400" />
                Support Tickets & Concierge ({userTickets.length})
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                24/7 dedicated support for order issues, custom commissions, and billing questions.
              </p>
            </div>

            <button
              id="open-new-ticket-btn"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Open New Ticket
            </button>
          </div>

          {/* Tickets List */}
          {userTickets.length > 0 ? (
            <div className="space-y-3">
              {userTickets.map(ticket => (
                <div
                  key={ticket.id}
                  id={`ticket-item-${ticket.ticketNumber}`}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-amber-300">#{ticket.ticketNumber}</span>
                      {getStatusBadge(ticket.status)}
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] border border-zinc-700">
                        {ticket.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-amber-400 transition truncate">
                      {ticket.subject}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1 truncate">
                      Latest message: {ticket.messages[ticket.messages.length - 1]?.text}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 transition" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800">
              <LifeBuoy className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
              <h3 className="text-sm font-semibold text-zinc-200">No support tickets</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto mb-4">
                Have a question about an order, custom project, or delivery? Our team is ready to help.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Open Support Ticket
              </button>
            </div>
          )}
        </>
      )}

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-amber-400" />
                Open Support Ticket
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="General">General Inquiry</option>
                  <option value="Order Issue">Order / Delivery Logistics</option>
                  <option value="Custom Project">Custom Atelier Commission</option>
                  <option value="Couple Website">Couple Website Sanctuary</option>
                  <option value="Payment / Refund">Payment / Refund</option>
                  <option value="Bot Panel">Bot Panel & Digital Services</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Inquiring on custom engraving options for Order #ORD-1234"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Detailed Message *</label>
                <textarea
                  required
                  rows={4}
                  value={initialMessage}
                  onChange={e => setInitialMessage(e.target.value)}
                  placeholder="Provide all relevant details so our concierge can resolve your inquiry swiftly..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
