import React, { useState } from 'react';
import { 
  Headphones, 
  Search, 
  Filter, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Mail, 
  Plus, 
  ShieldCheck, 
  Sparkles,
  X
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { SupportTicket } from '../../../types';
import { enforceServerSidePermission } from '../../../services/adminAuthService';

export const SupportAdminSection: React.FC = () => {
  const { tickets, createTicket, replyToTicket, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // New ticket modal
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('General');
  const [newInitialMsg, setNewInitialMsg] = useState('');
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');

  const filteredTickets = tickets
    .filter(t => !searchQuery || t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) || (t.customerEmail && t.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())))
    .filter(t => statusFilter === 'all' || t.status === statusFilter);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setIsSendingReply(true);
    try {
      await enforceServerSidePermission('support:manage', 'support_ticket', selectedTicket.id);
      replyToTicket(selectedTicket.id, replyMessage.trim(), 'support');
      showToast('Support response dispatched to customer.');
      setReplyMessage('');

      // Refresh selected ticket
      const updated = tickets.find(t => t.id === selectedTicket.id);
      if (updated) {
        setSelectedTicket({ ...updated });
      }
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Unable to reply to support ticket.');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleCreateNewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newInitialMsg.trim()) {
      showToast('Please provide subject and initial inquiry message.');
      return;
    }

    const created = createTicket(
      newSubject.trim(),
      newCategory,
      newInitialMsg.trim(),
      newCustName.trim() || 'Patron Inquirer',
      newCustEmail.trim() || 'concierge@harconxs.com'
    );

    setSelectedTicket(created);
    setIsNewTicketOpen(false);
    setNewSubject('');
    setNewInitialMsg('');
    setNewCustName('');
    setNewCustEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 flex items-center gap-2.5">
            <Headphones className="w-6 h-6 text-emerald-400" />
            <span>Patron Support & Helpdesk Hub</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time customer inquiries, live chat logs, and order-related assistance tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tickets Queue List */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Filter and Search Bar */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by ticket #, customer, subject..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-400"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'Open', 'In Progress', 'Waiting', 'Resolved', 'Closed'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap text-[11px] font-medium transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-amber-400 text-zinc-950 font-bold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredTickets.map(ticket => {
              const isSelected = selectedTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-md shadow-amber-500/5'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400">{ticket.ticketNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono capitalize ${
                      ticket.status === 'Open' ? 'bg-amber-500/20 text-amber-300' :
                      ticket.status === 'In Progress' ? 'bg-sky-500/20 text-sky-300' :
                      ticket.status === 'Waiting' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  <h4 className="font-semibold text-zinc-100 text-sm line-clamp-1">{ticket.subject}</h4>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400">
                    <span className="truncate max-w-[180px]">{ticket.customerName || ticket.customerEmail || 'Patron'}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}

            {filteredTickets.length === 0 && (
              <div className="p-8 text-center bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-500 text-xs">
                No support tickets found matching current query.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation Thread */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6 flex flex-col justify-between min-h-[550px]">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-amber-400 font-bold">{selectedTicket.ticketNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                        {selectedTicket.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-zinc-100 mt-1">{selectedTicket.subject}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Customer: <strong>{selectedTicket.customerName || 'Anonymous'}</strong> ({selectedTicket.customerEmail || 'No email provided'})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono capitalize ${
                      selectedTicket.status === 'Open' ? 'bg-amber-500/20 text-amber-300' :
                      selectedTicket.status === 'In Progress' ? 'bg-sky-500/20 text-sky-300' :
                      selectedTicket.status === 'Waiting' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>

                {/* Message Thread */}
                <div className="space-y-4 my-6 max-h-[360px] overflow-y-auto pr-2">
                  {selectedTicket.messages.map((msg, idx) => {
                    const isSupport = msg.sender === 'support';
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isSupport ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-4 rounded-2xl space-y-1.5 ${
                            isSupport
                              ? 'bg-amber-500/10 border border-amber-500/30 text-zinc-100'
                              : 'bg-zinc-950 border border-zinc-800 text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 text-[10px] font-mono">
                            <span className={isSupport ? 'text-amber-400 font-bold' : 'text-zinc-400'}>
                              {isSupport ? 'HARCONXS Atelier Concierge' : (selectedTicket.customerName || 'Customer')}
                            </span>
                            <span className="text-zinc-500">{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-4 border-t border-zinc-800">
                <textarea
                  rows={3}
                  required
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  placeholder="Type official atelier response to patron..."
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-400"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Encrypted Concierge Dispatch
                  </span>

                  <button
                    type="submit"
                    disabled={isSendingReply || !replyMessage.trim()}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingReply ? 'Sending...' : 'Send Reply'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs text-center">
              Select a support ticket from the list to view the conversation history and respond.
            </div>
          )}
        </div>

      </div>

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-zinc-100 text-lg">Log New Support Inquiry</h3>
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  placeholder="e.g. Ring resizing request"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={newCustName}
                    onChange={e => setNewCustName(e.target.value)}
                    placeholder="Aarav Singhania"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={newCustEmail}
                    onChange={e => setNewCustEmail(e.target.value)}
                    placeholder="customer@domain.com"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                >
                  <option value="General">General Inquiry</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Custom Project">Custom Project</option>
                  <option value="Couple Website">Couple Website</option>
                  <option value="Bot Panel">Bot Panel</option>
                  <option value="Payment / Refund">Payment / Refund</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Inquiry Details</label>
                <textarea
                  rows={4}
                  required
                  value={newInitialMsg}
                  onChange={e => setNewInitialMsg(e.target.value)}
                  placeholder="Describe the patron's request in detail..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md cursor-pointer"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
