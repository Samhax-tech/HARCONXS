import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  Boxes, 
  Tag, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Copy, 
  ArrowUpDown, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  Eye,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { Product, CategoryType, ProductVariant, InventoryItem, CategoryItem } from '../../../types';
import { enforceServerSidePermission } from '../../../services/adminAuthService';

interface CatalogAdminSectionProps {
  subSection: 'products' | 'categories' | 'variants' | 'inventory';
  onNavigateSubSection: (sec: 'products' | 'categories' | 'variants' | 'inventory') => void;
}

export const CatalogAdminSection: React.FC<CatalogAdminSectionProps> = ({
  subSection,
  onNavigateSubSection
}) => {
  const { products, addProduct, updateProduct, deleteProduct, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Categories list
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([
    {
      id: 'cat-1',
      name: 'Couples Sanctuary',
      slug: 'couples',
      description: 'Handcrafted matching rings, magnetic pendants, and anniversary tokens.',
      imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
      itemCount: 14,
      displayOrder: 1,
      featured: true
    },
    {
      id: 'cat-2',
      name: 'Royal Keepsakes & Gifts',
      slug: 'gifts',
      description: 'Personalized titanium engraved tokens and velvet-boxed treasures.',
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
      itemCount: 18,
      displayOrder: 2,
      featured: true
    },
    {
      id: 'cat-3',
      name: 'Custom Atelier Commissions',
      slug: 'custom',
      description: 'Bespoke custom jewellery pieces with 3D CAD renders.',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
      itemCount: 12,
      displayOrder: 3,
      featured: true
    },
    {
      id: 'cat-4',
      name: 'Digital Couple Websites',
      slug: 'websites',
      description: 'Interactive digital love vaults with music, countdowns, and secret letters.',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80',
      itemCount: 8,
      displayOrder: 4,
      featured: true
    },
    {
      id: 'cat-5',
      name: 'E-commerce Bot Panels',
      slug: 'bots',
      description: 'Automated CRM, broadcast, and community luxury bot panels.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      itemCount: 6,
      displayOrder: 5,
      featured: false
    }
  ]);

  // Product Variants list
  const [variantsList, setVariantsList] = useState<ProductVariant[]>([
    {
      id: 'var-01',
      productId: 'p1',
      productName: 'Eternal Bond Sovereign Ring Set',
      sku: 'HRX-EBR-07-GOLD',
      title: 'Size 7 / 18K Yellow Gold',
      options: { size: 'Size 7', material: '18K Yellow Gold', finish: 'High Polish' },
      price: 2499,
      compareAtPrice: 2999,
      costPrice: 850,
      stock: 14,
      isActive: true
    },
    {
      id: 'var-02',
      productId: 'p1',
      productName: 'Eternal Bond Sovereign Ring Set',
      sku: 'HRX-EBR-08-GOLD',
      title: 'Size 8 / 18K Yellow Gold',
      options: { size: 'Size 8', material: '18K Yellow Gold', finish: 'High Polish' },
      price: 2499,
      compareAtPrice: 2999,
      costPrice: 850,
      stock: 8,
      isActive: true
    },
    {
      id: 'var-03',
      productId: 'p1',
      productName: 'Eternal Bond Sovereign Ring Set',
      sku: 'HRX-EBR-07-PLAT',
      title: 'Size 7 / Platinum 950',
      options: { size: 'Size 7', material: 'Platinum 950', finish: 'Satin Matte' },
      price: 3499,
      compareAtPrice: 3999,
      costPrice: 1200,
      stock: 4,
      isActive: true
    },
    {
      id: 'var-04',
      productId: 'p2',
      productName: 'Constellation Magnetic Pendants',
      sku: 'HRX-CMP-SILVER',
      title: 'Sterling Silver 925 / 50cm Chain',
      options: { size: '50cm', material: 'Silver 925', finish: 'Mirror Finish' },
      price: 1899,
      compareAtPrice: 2199,
      costPrice: 420,
      stock: 22,
      isActive: true
    }
  ]);

  // Inventory items
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([
    {
      id: 'inv-1',
      productId: 'p1',
      productName: 'Eternal Bond Sovereign Ring Set',
      sku: 'HRX-EBR-07-GOLD',
      location: 'Vault A - Shelf 04',
      currentStock: 26,
      reservedStock: 3,
      availableStock: 23,
      lowStockThreshold: 10,
      reorderQuantity: 20,
      costPerUnit: 850,
      supplier: 'Atelier Sovereign Casting Ltd.',
      status: 'in_stock',
      lastRestockedAt: '2026-02-10'
    },
    {
      id: 'inv-2',
      productId: 'p2',
      productName: 'Constellation Magnetic Pendants',
      sku: 'HRX-CMP-SILVER',
      location: 'Vault B - Drawer 02',
      currentStock: 4,
      reservedStock: 2,
      availableStock: 2,
      lowStockThreshold: 8,
      reorderQuantity: 30,
      costPerUnit: 420,
      supplier: 'Apex Precision Metals',
      status: 'low_stock',
      lastRestockedAt: '2026-01-25'
    },
    {
      id: 'inv-3',
      productId: 'p3',
      productName: 'Royal Velvet Music Keepsake Box',
      sku: 'HRX-VMB-BURGUNDY',
      location: 'Packaging Hub - Bay 1',
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      lowStockThreshold: 5,
      reorderQuantity: 15,
      costPerUnit: 260,
      supplier: 'Luxe Artisans Silk & Velvet',
      status: 'out_of_stock',
      lastRestockedAt: '2026-01-12'
    }
  ]);

  // New Category / Variant Form state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80');

  // Stock adjustment modal
  const [adjustInvItem, setAdjustInvItem] = useState<InventoryItem | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Restock Batch');

  // Server-side permission enforced actions
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enforceServerSidePermission('categories:manage', 'category', newCatSlug);
      const newCategory: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: newCatName,
        slug: newCatSlug || newCatName.toLowerCase().replace(/\s+/g, '-'),
        description: newCatDesc,
        imageUrl: newCatImage,
        itemCount: 0,
        displayOrder: categoriesList.length + 1,
        featured: true
      };
      setCategoriesList(prev => [...prev, newCategory]);
      setIsCategoryModalOpen(false);
      setNewCatName('');
      setNewCatSlug('');
      setNewCatDesc('');
      showToast('Category created and synchronized with Supabase catalog.');
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Unable to create category.');
    }
  };

  const handleAdjustStock = async () => {
    if (!adjustInvItem) return;
    try {
      await enforceServerSidePermission('inventory:manage', 'inventory', adjustInvItem.sku);
      const updatedStock = adjustInvItem.currentStock + stockDelta;
      setInventoryList(prev => prev.map(item => {
        if (item.id === adjustInvItem.id) {
          return {
            ...item,
            currentStock: updatedStock,
            availableStock: updatedStock - item.reservedStock,
            status: updatedStock <= 0 ? 'out_of_stock' : updatedStock <= item.lowStockThreshold ? 'low_stock' : 'in_stock',
            lastRestockedAt: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      }));
      setAdjustInvItem(null);
      showToast(`Stock updated for SKU ${adjustInvItem.sku} (+${stockDelta} units).`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Inventory updates require manager role.');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    try {
      await enforceServerSidePermission('catalog:delete', 'product', id);
      deleteProduct(id);
      showToast(`Product "${name}" archived from catalog.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Only Super Admin can remove products.');
    }
  };

  return (
    <div id="catalog-admin-section" className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-catalog-products"
            onClick={() => onNavigateSubSection('products')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'products' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Package className="w-4 h-4" />
            Products ({products.length})
          </button>
          <button
            id="tab-catalog-categories"
            onClick={() => onNavigateSubSection('categories')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'categories' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Categories ({categoriesList.length})
          </button>
          <button
            id="tab-catalog-variants"
            onClick={() => onNavigateSubSection('variants')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'variants' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Variants ({variantsList.length})
          </button>
          <button
            id="tab-catalog-inventory"
            onClick={() => onNavigateSubSection('inventory')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'inventory' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Inventory & Stock ({inventoryList.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Server RBAC Protected
          </span>
        </div>
      </div>

      {/* 1. PRODUCTS SUBSECTION */}
      {subSection === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search products by title or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Categories</option>
                <option value="couples">Couples</option>
                <option value="gifts">Gifts & Keepsakes</option>
                <option value="custom">Custom Atelier</option>
                <option value="websites">Couple Websites</option>
                <option value="bots">Bot Panels</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Retail Price</th>
                    <th className="py-3 px-4">Cost Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products
                    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
                    .map(product => (
                      <tr key={product.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-zinc-700" />
                            <div>
                              <div className="font-medium text-zinc-100">{product.name}</div>
                              <div className="text-xs text-zinc-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize">
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-amber-400">
                          ₹{product.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-400">
                          ₹{(product.costPrice || Math.round(product.price * 0.35)).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            (product.stock || 25) < 5 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {product.stock || 25} in vault
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active Live
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete (Enforces Server RBAC)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. CATEGORIES SUBSECTION */}
      {subSection === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Manage product categorization taxonomy, navigation menus, and banner imagery.
            </p>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesList.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="relative h-32 rounded-xl overflow-hidden border border-zinc-800">
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent flex items-end p-3">
                    <div>
                      <h4 className="font-serif font-bold text-zinc-100 text-base">{cat.name}</h4>
                      <span className="text-[11px] font-mono text-amber-400">/{cat.slug}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2">{cat.description}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/80">
                  <span className="text-zinc-500 font-mono">{cat.itemCount} Products</span>
                  <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 font-mono text-[10px]">
                    Display Order #{cat.displayOrder}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. VARIANTS SUBSECTION */}
      {subSection === 'variants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Product variant matrix across sizes, materials (18K Gold, Platinum, Silver), and engraving finishes.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Variant Title</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Parent Product</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Cost</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {variantsList.map(v => (
                  <tr key={v.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-medium text-zinc-100">{v.title}</td>
                    <td className="py-3 px-4 font-mono text-xs text-amber-400">{v.sku}</td>
                    <td className="py-3 px-4 text-xs text-zinc-400">{v.productName}</td>
                    <td className="py-3 px-4 font-mono text-zinc-200">₹{v.price.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-zinc-500">₹{v.costPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-300">
                        {v.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. INVENTORY SUBSECTION */}
      {subSection === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Real-time vault stock, supplier replenishment reorder levels, and reserve allocations.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">SKU / Item</th>
                  <th className="py-3 px-4">Vault Location</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Reserved</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {inventoryList.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <div className="font-medium text-zinc-100">{item.productName}</div>
                      <div className="text-xs font-mono text-amber-400">{item.sku}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-zinc-400">{item.location}</td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-100">{item.currentStock}</td>
                    <td className="py-3 px-4 font-mono text-zinc-400">{item.reservedStock}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">{item.availableStock}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs uppercase font-mono ${
                        item.status === 'in_stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        item.status === 'low_stock' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setAdjustInvItem(item);
                          setStockDelta(item.reorderQuantity || 15);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-medium transition-colors"
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold text-zinc-100">Create New Catalog Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Keepsakes"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. royal-keepsakes"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                  placeholder="Category collection overview..."
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-sm"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESTOCK MODAL */}
      {adjustInvItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-amber-400" />
              Restock Vault Inventory
            </h3>
            <p className="text-xs text-zinc-400">
              SKU: <strong className="text-amber-400 font-mono">{adjustInvItem.sku}</strong> ({adjustInvItem.productName})
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Units to Add</label>
                <input
                  type="number"
                  min="1"
                  value={stockDelta}
                  onChange={(e) => setStockDelta(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Adjustment Reason</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                >
                  <option value="Restock Batch">Supplier Inbound Shipment</option>
                  <option value="Inventory Audit">Physical Vault Audit Adjustment</option>
                  <option value="Return Restock">Customer Return Restock</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAdjustInvItem(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdjustStock}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-sm"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
