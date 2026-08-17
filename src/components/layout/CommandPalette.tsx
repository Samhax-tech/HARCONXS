import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Shield, Sparkles, X, ArrowRight, FileText, Globe, Bot } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    products,
    orders,
    customOrders,
    setCurrentView,
    setSelectedProductId,
    setSelectedCategory,
    formatPrice,
    setIsAdminMode
  } = useStore();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
    p.sku.toLowerCase().includes(query.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
    o.customerName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCustomOrders = customOrders.filter(co =>
    co.requestNumber.toLowerCase().includes(query.toLowerCase()) ||
    co.productType.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
    setIsCommandPaletteOpen(false);
  };

  const handleQuickNav = (view: string, category?: string) => {
    if (category) {
      setSelectedCategory(category as any);
    }
    setCurrentView(view);
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search header */}
        <div className="flex items-center px-4 border-b border-zinc-800 py-3 gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a product, order number (HX-...), custom order (CO-...), or action..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block bg-zinc-900 text-zinc-400 text-xs px-2 py-0.5 rounded border border-zinc-800 font-mono">
            ESC
          </kbd>
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick Actions */}
          {!query && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Instant Navigation</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickNav('catalog', 'couples')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-zinc-200 text-left transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="truncate">Couples Atelier</span>
                </button>
                <button
                  onClick={() => handleQuickNav('custom-builder')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-zinc-200 text-left transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Create Custom Order</span>
                </button>
                <button
                  onClick={() => handleQuickNav('couple-builder')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-zinc-200 text-left transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Couple Websites</span>
                </button>
                <button
                  onClick={() => handleQuickNav('bot-panels')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-zinc-200 text-left transition-colors cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="truncate">Bot Panels</span>
                </button>
                <button
                  onClick={() => handleQuickNav('account')}
                  className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-zinc-200 text-left transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-violet-400 shrink-0" />
                  <span className="truncate">My Orders & Tracking</span>
                </button>
                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    handleQuickNav('admin');
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/20 hover:bg-amber-950/40 border border-amber-800/40 text-amber-300 text-left transition-colors cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Admin Command</span>
                </button>
              </div>
            </div>
          )}

          {/* Matched Products */}
          {filteredProducts.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Products ({filteredProducts.length})</p>
              <div className="space-y-1.5">
                {filteredProducts.slice(0, 5).map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={product.images[0]} alt={product.name} className="w-9 h-9 object-cover rounded bg-zinc-800 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-200 truncate group-hover:text-amber-300 transition-colors">{product.name}</p>
                        <p className="text-[11px] text-zinc-400">{product.sku} • {product.category.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="font-semibold text-zinc-100">{formatPrice(product.price)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Orders */}
          {filteredOrders.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Orders</p>
              <div className="space-y-1.5">
                {filteredOrders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => handleQuickNav('account')}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span className="font-mono text-zinc-200 font-semibold">{order.orderNumber}</span>
                      <span className="text-zinc-400">• {order.customerName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-medium">{order.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Custom Orders */}
          {filteredCustomOrders.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Custom Project Requests</p>
              <div className="space-y-1.5">
                {filteredCustomOrders.map(co => (
                  <button
                    key={co.id}
                    onClick={() => handleQuickNav('custom-portal')}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-mono text-zinc-200 font-semibold shrink-0">{co.requestNumber}</span>
                      <span className="text-zinc-400 truncate">{co.productType}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950/60 text-rose-300 border border-rose-800/50 font-medium shrink-0 ml-2">
                      {co.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredProducts.length === 0 && filteredOrders.length === 0 && filteredCustomOrders.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              <p>No results found for "{query}"</p>
              <p className="text-[11px] mt-1 text-zinc-600">Try searching for bracelets, couple websites, bot panel, or an order number.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Press <strong>ESC</strong> to close</span>
          <span>HARCONXS Quick Dispatch Engine</span>
        </div>
      </div>
    </div>
  );
};
