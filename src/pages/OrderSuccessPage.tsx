import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Truck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || 'HAR-98234';
  const { formatPrice } = useStore();

  return (
    <div className="bg-zinc-950 min-h-[85vh] py-16 px-4 flex items-center justify-center text-zinc-200">
      <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 space-y-6 text-center shadow-2xl">
        
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
            Payment Confirmed • Atelier Production Scheduled
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Thank You For Your Commission!
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
            Your piece has been queued in our master engraving workshop. A tracking dispatch notice has been emailed with your digital certificate.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-500">Order Reference</span>
          <span className="font-mono font-bold text-amber-400">{orderNumber}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            to="/account/orders"
            className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Track Delivery</span>
          </Link>
          <Link
            to="/shop"
            className="py-3 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/10"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
