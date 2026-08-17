import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  HelpCircle,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Globe
} from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { createTicket, socialLinks, showToast, currentUser } = useStore();

  const [name, setName] = useState(currentUser ? currentUser.name : '');
  const [email, setEmail] = useState(currentUser ? currentUser.email : '');
  const [category, setCategory] = useState<'General' | 'Order Issue' | 'Custom Project' | 'Couple Website' | 'Bot Panel' | 'Payment / Refund'>('General');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketNo, setSubmittedTicketNo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ticket = createTicket(
        subject || `${category} Inquiry`,
        category,
        message,
        name,
        email
      );
      setIsSubmitting(false);
      setSubmittedTicketNo(ticket.ticketNumber);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      showToast(`Support ticket ${ticket.ticketNumber} logged successfully.`);
    }, 600);
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 pb-20">
      
      {/* 1. HERO HEADER */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Concierge & Client Support</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-100">
            We Are Here to Assist Your Atelier Experience
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Whether you have questions regarding a custom engraving brief, couple website domain setup, bot panel webhook routing, or express delivery across India, our specialists respond promptly.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: CONTACT CHANNELS & QUICK WHATSAPP */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Instant WhatsApp Card (High India Conversion) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-700/50 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Instant WhatsApp Concierge</h3>
                  <p className="text-xs text-emerald-300">Fastest response for Indian & global clients</p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Connect with our master artisans on WhatsApp for live photo proofs, engraving draft previews, or quick order status updates.
              </p>

              <a
                href="https://wa.me/919876543210?text=Hi%20HARCONXS%20Team%2C%20I%20have%20an%20inquiry%20regarding%20an%20order%2Fcustom%20product."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Chat on WhatsApp (+91 98765 43210)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Support Desk Details */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                Atelier Studio & Help Desk
              </h3>

              <div className="space-y-3.5 text-xs text-zinc-300">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-100">Official Email</p>
                    <a href="mailto:support@harconxs.com" className="text-zinc-400 hover:text-amber-400 transition-colors">
                      support@harconxs.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-100">India Direct Line</p>
                    <p className="text-zinc-400">+91 98765 43210 / +91 80 4123 9087</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-100">Operating Hours</p>
                    <p className="text-zinc-400">Monday – Saturday: 10:00 AM – 8:00 PM IST</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">● Live chat active now</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-100">Artisan Workshop & Labs</p>
                    <p className="text-zinc-400">Atelier Studio #14, Indiranagar Tech Corridor, Bangalore, Karnataka, 560038, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Indian Fast Shipping Promise */}
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-zinc-200">Express Delivery Across India</p>
                <p className="text-zinc-400">BlueDart, Delhivery & DTDC: 2-3 days metro turnaround</p>
              </div>
            </div>

          </div>

          {/* RIGHT: INTERACTIVE TICKET & INQUIRY FORM */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
              
              <div className="space-y-1 mb-6">
                <h3 className="text-lg font-serif font-bold text-zinc-100">
                  Send a Direct Message / Open a Ticket
                </h3>
                <p className="text-xs text-zinc-400">
                  Fill out the details below and an atelier representative will reply to your email within 2 hours.
                </p>
              </div>

              {submittedTicketNo ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-700/60 rounded-xl text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Ticket Submitted Successfully!</h4>
                  <p className="text-xs text-zinc-300">
                    Your reference ID is <strong className="text-emerald-400 font-mono">{submittedTicketNo}</strong>. A confirmation has been logged to your support record.
                  </p>
                  <button
                    onClick={() => setSubmittedTicketNo(null)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Hamza"
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                        Your Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                        Inquiry Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="General">General Inquiry</option>
                        <option value="Custom Project">Custom Laser / Gift Commission</option>
                        <option value="Couple Website">Couple Website Domain / Setup</option>
                        <option value="Bot Panel">Bot Dashboard / Webhook Integration</option>
                        <option value="Order Issue">Order Tracking & Shipping</option>
                        <option value="Payment / Refund">Payment & Billing Gateway</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Laser engraving brief or Order #HX-1029"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                      Detailed Message / Requirements *
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please describe your question, engraving text, date requirements, or service requirements in detail..."
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Dispatching ticket...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Support Ticket</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

            {/* Frequent Delivery Questions */}
            <div className="mt-8 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Frequently Asked Questions</span>
              </h4>

              <div className="space-y-2 text-xs">
                <details className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 group">
                  <summary className="font-semibold text-zinc-200 cursor-pointer list-none flex justify-between items-center">
                    <span>What is the shipping turnaround time for India?</span>
                    <span className="text-amber-400 group-open:rotate-90 transition-transform">›</span>
                  </summary>
                  <p className="text-zinc-400 mt-2 leading-relaxed">
                    Standard non-custom pieces dispatch within 24 hours. Custom laser engraved coordinates and jewelry require 2 business days of atelier craftsmanship. Metro cities (Bangalore, Mumbai, Delhi NCR, Hyderabad, Chennai) receive delivery in 2-3 business days.
                  </p>
                </details>

                <details className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 group">
                  <summary className="font-semibold text-zinc-200 cursor-pointer list-none flex justify-between items-center">
                    <span>How do couple websites work?</span>
                    <span className="text-amber-400 group-open:rotate-90 transition-transform">›</span>
                  </summary>
                  <p className="text-zinc-400 mt-2 leading-relaxed">
                    Once ordered, you can customize photos, relationship timers, Spotify audio, and memory timelines. Your website is instantly deployed to a custom subdomain (e.g. alex-and-sarah.harconxs.com) with lifetime cloud hosting and SSL encryption.
                  </p>
                </details>

                <details className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 group">
                  <summary className="font-semibold text-zinc-200 cursor-pointer list-none flex justify-between items-center">
                    <span>Which payment methods are supported?</span>
                    <span className="text-amber-400 group-open:rotate-90 transition-transform">›</span>
                  </summary>
                  <p className="text-zinc-400 mt-2 leading-relaxed">
                    We accept UPI (GPay, PhonePe, Paytm, BHIM), Indian & International Debit/Credit cards, Net Banking, and Cash on Delivery (COD) for eligible physical items.
                  </p>
                </details>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
