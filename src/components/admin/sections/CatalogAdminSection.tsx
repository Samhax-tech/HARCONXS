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
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    bulkAddProducts, 
    bulkDeleteProducts, 
    showToast 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Product Selection for Bulk Operations
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    slug: '',
    category: 'couples',
    price: 1999,
    compareAtPrice: 2499,
    costPrice: 650,
    stock: 25,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    featured: false,
    rating: 5.0,
    reviewCount: 1,
    tags: ['handcrafted', 'sovereign']
  });

  // Bulk Import Modal State
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [bulkImportJson, setBulkImportJson] = useState<string>(
    JSON.stringify([
      {
        name: "Celestial Orbit Platinum Band",
        category: "couples",
        price: 2899,
        compareAtPrice: 3499,
        costPrice: 900,
        stock: 15,
        description: "Pure PT950 platinum matching promise band with laser etched star map.",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80",
        tags: ["platinum", "couples", "rings"],
        inStock: true
      },
      {
        name: "Sovereign Rose Gold Couple Lockets",
        category: "gifts",
        price: 3199,
        compareAtPrice: 3899,
        costPrice: 1100,
        stock: 20,
        description: "18K Rose Gold magnetic holding lockets with velvet keepsake casing.",
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
        tags: ["rose gold", "lockets", "keepsakes"],
        inStock: true
      }
    ], null, 2)
  );

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

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      slug: '',
      category: 'couples',
      price: 1999,
      compareAtPrice: 2499,
      costPrice: 650,
      stock: 25,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      inStock: true,
      featured: false,
      rating: 5.0,
      reviewCount: 1,
      tags: ['handcrafted', 'sovereign'],
      // SEO & Merchant Center
      seoTitle: '',
      seoDescription: '',
      canonicalUrl: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      brand: 'HARCONXS',
      googleProductCategory: 'Apparel & Accessories > Jewelry',
      gtin: '',
      mpn: '',
      condition: 'new'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      slug: prod.slug,
      category: prod.category,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice || Math.round(prod.price * 1.25),
      costPrice: prod.costPrice || Math.round(prod.price * 0.35),
      stock: prod.stock || 25,
      description: prod.description,
      imageUrl: prod.imageUrl,
      inStock: prod.inStock !== false,
      featured: prod.featured || false,
      rating: prod.rating || 5.0,
      reviewCount: prod.reviewCount || 1,
      tags: prod.tags || ['atelier'],
      // SEO & Merchant Center
      seoTitle: prod.seoTitle || prod.name,
      seoDescription: prod.seoDescription || prod.shortDescription || prod.description || '',
      canonicalUrl: prod.canonicalUrl || '',
      ogTitle: prod.ogTitle || prod.name,
      ogDescription: prod.ogDescription || prod.shortDescription || prod.description || '',
      ogImage: prod.ogImage || prod.ogImageUrl || prod.imageUrl || (prod.images && prod.images[0]) || '',
      brand: prod.brand || 'HARCONXS',
      googleProductCategory: prod.googleProductCategory || 'Apparel & Accessories > Jewelry',
      gtin: prod.gtin || prod.barcode || '',
      mpn: prod.mpn || prod.sku || '',
      condition: prod.condition || 'new'
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('Please fill in product name and valid retail price.');
      return;
    }

    try {
      if (editingProduct) {
        await enforceServerSidePermission('catalog:edit', 'product', editingProduct.id);
        const updated: Product = {
          ...editingProduct,
          name: productForm.name,
          slug: productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category: productForm.category as CategoryType,
          price: Number(productForm.price),
          compareAtPrice: Number(productForm.compareAtPrice || 0),
          costPrice: Number(productForm.costPrice || 0),
          stock: Number(productForm.stock || 0),
          description: productForm.description || '',
          imageUrl: productForm.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
          inStock: productForm.inStock !== false,
          featured: !!productForm.featured,
          tags: Array.isArray(productForm.tags) ? productForm.tags : (typeof productForm.tags === 'string' ? (productForm.tags as string).split(',').map(t => t.trim()) : []),
          // SEO & Merchant Center
          seoTitle: productForm.seoTitle || productForm.name,
          seoDescription: productForm.seoDescription || productForm.description || '',
          canonicalUrl: productForm.canonicalUrl || undefined,
          ogTitle: productForm.ogTitle || productForm.seoTitle || productForm.name,
          ogDescription: productForm.ogDescription || productForm.seoDescription || productForm.description || '',
          ogImage: productForm.ogImage || productForm.imageUrl || undefined,
          brand: productForm.brand || 'HARCONXS',
          googleProductCategory: productForm.googleProductCategory || 'Apparel & Accessories > Jewelry',
          gtin: productForm.gtin || undefined,
          mpn: productForm.mpn || editingProduct.sku || undefined,
          condition: (productForm.condition || 'new') as any
        };
        updateProduct(updated);
        showToast(`Product "${updated.name}" updated successfully.`);
      } else {
        await enforceServerSidePermission('catalog:create', 'product', 'new');
        const generatedSlug = productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newProduct: Product = {
          id: `prod_${Date.now()}`,
          sku: `HX-CAT-${Math.floor(1000 + Math.random() * 9000)}`,
          name: productForm.name,
          slug: generatedSlug,
          category: productForm.category as CategoryType,
          price: Number(productForm.price),
          compareAtPrice: Number(productForm.compareAtPrice || 0),
          costPrice: Number(productForm.costPrice || 0),
          stock: Number(productForm.stock || 25),
          description: productForm.description || '',
          imageUrl: productForm.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
          inStock: productForm.inStock !== false,
          featured: !!productForm.featured,
          rating: 5.0,
          reviewCount: 1,
          tags: Array.isArray(productForm.tags) ? productForm.tags : (typeof productForm.tags === 'string' ? (productForm.tags as string).split(',').map(t => t.trim()) : []),
          // SEO & Merchant Center
          seoTitle: productForm.seoTitle || productForm.name,
          seoDescription: productForm.seoDescription || productForm.description || '',
          canonicalUrl: productForm.canonicalUrl || undefined,
          ogTitle: productForm.ogTitle || productForm.seoTitle || productForm.name,
          ogDescription: productForm.ogDescription || productForm.seoDescription || productForm.description || '',
          ogImage: productForm.ogImage || productForm.imageUrl || undefined,
          brand: productForm.brand || 'HARCONXS',
          googleProductCategory: productForm.googleProductCategory || 'Apparel & Accessories > Jewelry',
          gtin: productForm.gtin || undefined,
          mpn: productForm.mpn || undefined,
          condition: (productForm.condition || 'new') as any,
          cost: Number(productForm.costPrice || 0),
          inventory: Number(productForm.stock || 25),
          shortDescription: productForm.description || '',
          fullDescription: productForm.description || '',
          subcategory: 'Atelier',
          badges: ['New'],
          productType: 'physical',
          images: [productForm.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'],
          createdAt: new Date().toISOString()
        };
        addProduct(newProduct);
        showToast(`Product "${newProduct.name}" added to catalog.`);
      }
      setIsProductModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Unable to save product.');
    }
  };

  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (filteredProds: Product[]) => {
    if (selectedProductIds.length === filteredProds.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProds.map(p => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    const confirm = window.confirm(`Permanently delete ${selectedProductIds.length} selected products from catalog?`);
    if (!confirm) return;

    try {
      await enforceServerSidePermission('catalog:delete', 'product', 'bulk');
      bulkDeleteProducts(selectedProductIds);
      showToast(`Successfully deleted ${selectedProductIds.length} products in bulk.`);
      setSelectedProductIds([]);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Unable to delete products in bulk.');
    }
  };

  const handleBulkImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(bulkImportJson);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        showToast('Please provide a valid JSON array of product objects.');
        return;
      }
      await enforceServerSidePermission('catalog:create', 'product', 'bulk');
      const preparedProducts: Product[] = parsed.map((p, idx) => {
        const prodName = p.name || 'Untitled Atelier Item';
        const prodPrice = Number(p.price || 999);
        const prodImg = p.imageUrl || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80';
        const prodDesc = p.description || p.fullDescription || p.shortDescription || '';
        return {
          id: p.id || `prod_bulk_${Date.now()}_${idx}`,
          sku: p.sku || `HX-BULK-${Math.floor(1000 + Math.random() * 9000)}`,
          name: prodName,
          slug: p.slug || prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          shortDescription: p.shortDescription || prodDesc,
          fullDescription: p.fullDescription || prodDesc,
          description: prodDesc,
          price: prodPrice,
          compareAtPrice: Number(p.compareAtPrice || 0),
          cost: Number(p.cost || p.costPrice || 0),
          costPrice: Number(p.costPrice || p.cost || 0),
          inventory: Number(p.inventory || p.stock || 20),
          stock: Number(p.stock || p.inventory || 20),
          category: (p.category || 'couples') as CategoryType,
          subcategory: p.subcategory || 'Atelier',
          tags: Array.isArray(p.tags) ? p.tags : ['sovereign'],
          badges: Array.isArray(p.badges) ? p.badges : ['New'],
          brand: p.brand || 'HARCONXS',
          productType: p.productType || 'physical',
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [prodImg],
          imageUrl: prodImg,
          rating: Number(p.rating || 5.0),
          reviewCount: Number(p.reviewCount || 1),
          inStock: p.inStock !== false,
          featured: !!p.featured,
          createdAt: p.createdAt || new Date().toISOString(),
          seoTitle: p.seoTitle || prodName,
          seoDescription: p.seoDescription || prodDesc,
          ogTitle: p.ogTitle || prodName,
          ogDescription: p.ogDescription || prodDesc,
          ogImage: p.ogImage || prodImg,
          gtin: p.gtin || p.barcode || undefined,
          barcode: p.barcode || p.gtin || undefined,
          mpn: p.mpn || p.sku || undefined,
          googleProductCategory: p.googleProductCategory || 'Apparel & Accessories > Jewelry',
          condition: (p.condition || 'new') as any
        };
      });

      bulkAddProducts(preparedProducts);
      showToast(`Successfully bulk imported ${preparedProducts.length} products.`);
      setIsBulkImportModalOpen(false);
    } catch (err: any) {
      showToast(`JSON Parsing or Import Error: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    const confirm = window.confirm(`Archive and delete product "${name}" from store catalog?`);
    if (!confirm) return;
    try {
      await enforceServerSidePermission('catalog:delete', 'product', id);
      deleteProduct(id);
      setSelectedProductIds(prev => prev.filter(x => x !== id));
      showToast(`Product "${name}" archived from catalog.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Only Super Admin can remove products.');
    }
  };

  const filteredProducts = products
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.id && p.id.toLowerCase().includes(searchQuery.toLowerCase())))
    .filter(p => categoryFilter === 'all' || p.category === categoryFilter);

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
          {/* Top Controls & Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search products by title or ID..."
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

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                id="bulk-import-products-btn"
                onClick={() => setIsBulkImportModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Boxes className="w-4 h-4 text-amber-400" />
                Bulk Import
              </button>
              <button
                id="add-single-product-btn"
                onClick={handleOpenAddProduct}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>

          {/* BULK ACTION BAR */}
          {selectedProductIds.length > 0 && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span><strong>{selectedProductIds.length}</strong> products selected</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setSelectedProductIds([])}
                  className="px-3 py-1.5 min-h-[36px] rounded-xl bg-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs transition-colors cursor-pointer"
                >
                  Deselect All
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 min-h-[36px] rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Selected ({selectedProductIds.length})
                </button>
              </div>
            </div>
          )}

          {/* MOBILE CARDS VIEW (< md screens) */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map(product => {
              const isSelected = selectedProductIds.includes(product.id);
              return (
                <div 
                  key={product.id} 
                  className={`p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 ${isSelected ? 'border-amber-500/50 bg-amber-500/5' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectProduct(product.id)}
                        className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-amber-400 cursor-pointer"
                      />
                      <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-zinc-700 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-zinc-100 text-sm leading-snug">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-mono text-zinc-400">{product.id}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300 capitalize">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Retail Price</span>
                      <span className="font-mono font-bold text-amber-400 text-sm">₹{product.price.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Stock Status</span>
                      <span className={`font-mono text-xs font-medium ${(product.stock || 25) < 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {product.stock || 25} in vault
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Live
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        className="px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="p-2 min-w-[38px] min-h-[38px] rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW (>= md screens) */}
          <div className="hidden md:block rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.length > 0 && selectedProductIds.length === filteredProducts.length}
                        onChange={() => handleToggleSelectAll(filteredProducts)}
                        className="rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-amber-400 cursor-pointer"
                      />
                    </th>
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
                  {filteredProducts.map(product => {
                    const isSelected = selectedProductIds.includes(product.id);
                    return (
                      <tr key={product.id} className={`hover:bg-zinc-800/40 transition-colors ${isSelected ? 'bg-amber-500/5' : ''}`}>
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectProduct(product.id)}
                            className="rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-amber-400 cursor-pointer"
                          />
                        </td>
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
                              onClick={() => handleOpenEditProduct(product)}
                              className="p-2 min-w-[36px] min-h-[36px] rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="p-2 min-w-[36px] min-h-[36px] rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer flex items-center justify-center"
                              title="Delete (Enforces Server RBAC)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

          {/* MOBILE VARIANTS VIEW */}
          <div className="md:hidden space-y-3">
            {variantsList.map(v => (
              <div key={v.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-zinc-100 text-sm">{v.title}</h4>
                    <p className="text-xs text-zinc-400">{v.productName}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2.5 rounded-xl text-xs border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">SKU</span>
                    <span className="font-mono text-amber-400 font-medium">{v.sku}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Price</span>
                    <span className="font-mono text-zinc-200 font-medium">₹{v.price.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Stock</span>
                    <span className="font-mono text-zinc-300">{v.stock} pcs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VARIANTS TABLE */}
          <div className="hidden md:block rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
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

          {/* MOBILE INVENTORY VIEW */}
          <div className="md:hidden space-y-3">
            {inventoryList.map(item => (
              <div key={item.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-zinc-100 text-sm">{item.productName}</h4>
                    <span className="text-xs font-mono text-amber-400">{item.sku}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs uppercase font-mono ${
                    item.status === 'in_stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    item.status === 'low_stock' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2.5 rounded-xl text-xs border border-zinc-800 text-center">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Total Vault</span>
                    <span className="font-mono font-bold text-zinc-100 text-sm">{item.currentStock}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Reserved</span>
                    <span className="font-mono text-zinc-400">{item.reservedStock}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Available</span>
                    <span className="font-mono font-bold text-emerald-400">{item.availableStock}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-mono text-zinc-400">{item.location}</span>
                  <button
                    onClick={() => {
                      setAdjustInvItem(item);
                      setStockDelta(item.reorderQuantity || 15);
                    }}
                    className="px-3.5 py-2 min-h-[38px] rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    + Restock Vault
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP INVENTORY TABLE */}
          <div className="hidden md:block rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
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
                        className="px-3 py-1.5 min-h-[36px] rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-medium transition-colors cursor-pointer"
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
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdjustStock}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-sm cursor-pointer"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Atelier Product'}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Configure real-time pricing, vault inventory, visual assets, and taxonomy.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Celestial Orbit Platinum Promise Band"
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="celestial-orbit-platinum-band"
                    value={productForm.slug || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
                  <select
                    value={productForm.category || 'couples'}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value as CategoryType }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400 cursor-pointer"
                  >
                    <option value="couples">Couples Sanctuary</option>
                    <option value="gifts">Royal Keepsakes & Gifts</option>
                    <option value="custom">Custom Atelier</option>
                    <option value="websites">Couple Websites</option>
                    <option value="bots">Bot Panels Cloud</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Retail Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 font-mono font-bold text-sm focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Compare At / Strikethrough Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 2999"
                    value={productForm.compareAtPrice || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, compareAtPrice: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono text-sm focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Cost Price (₹ COGS)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 700"
                    value={productForm.costPrice || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, costPrice: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono text-sm focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Vault Inventory Stock (Units)</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock || 0}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-sm focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Main Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.imageUrl || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                  />
                  {productForm.imageUrl && (
                    <div className="mt-2 flex items-center gap-3">
                      <img src={productForm.imageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-zinc-700" />
                      <span className="text-xs text-zinc-500">Asset preview loaded</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    placeholder="Exquisite handcrafted heirloom piece created with bespoke precision..."
                    value={productForm.description || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="platinum, promise band, couples, 18k"
                    value={Array.isArray(productForm.tags) ? productForm.tags.join(', ') : (productForm.tags || '')}
                    onChange={(e) => setProductForm(prev => ({ ...prev, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={productForm.inStock !== false}
                      onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-amber-400"
                    />
                    <span>Available In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={!!productForm.featured}
                      onChange={(e) => setProductForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded bg-zinc-950 border-zinc-700 text-amber-400 focus:ring-amber-400"
                    />
                    <span>Featured on Storefront</span>
                  </label>
                </div>

                {/* SEO & GOOGLE MERCHANT CENTER SECTION */}
                <div className="sm:col-span-2 pt-4 border-t border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Production SEO &amp; Google Merchant Center Configuration
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Structured Data / XML Feed Ready</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        SEO Title Tag <span className="text-zinc-500">({(productForm.seoTitle || productForm.name || '').length}/60 chars)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Celestial Orbit Platinum Promise Band | HARCONXS"
                        value={productForm.seoTitle || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Canonical URL Override (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://harconxs.com/product/celestial-orbit-band"
                        value={productForm.canonicalUrl || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      SEO Meta Description <span className="text-zinc-500">({(productForm.seoDescription || productForm.description || '').length}/160 chars)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Handcrafted in sovereign 18K/Platinum fine jewelry atelier with verified gemstone certification and complimentary insured air express."
                      value={productForm.seoDescription || ''}
                      onChange={(e) => setProductForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">OpenGraph (OG) Social Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Celestial Orbit Platinum Promise Band"
                        value={productForm.ogTitle || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, ogTitle: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">OpenGraph (OG) Image URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={productForm.ogImage || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, ogImage: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={productForm.brand || 'HARCONXS'}
                        onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">GTIN / UPC / Barcode</label>
                      <input
                        type="text"
                        placeholder="8904561237890"
                        value={productForm.gtin || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, gtin: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">MPN (Part Number)</label>
                      <input
                        type="text"
                        placeholder="HX-PLT-009"
                        value={productForm.mpn || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, mpn: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-mono focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Google Product Category</label>
                      <input
                        type="text"
                        value={productForm.googleProductCategory || 'Apparel & Accessories > Jewelry'}
                        onChange={(e) => setProductForm(prev => ({ ...prev, googleProductCategory: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Product Condition</label>
                      <select
                        value={productForm.condition || 'new'}
                        onChange={(e) => setProductForm(prev => ({ ...prev, condition: e.target.value as Product['condition'] }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400 cursor-pointer"
                      >
                        <option value="new">New Condition (Brand New)</option>
                        <option value="refurbished">Refurbished</option>
                        <option value="used">Used</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  {editingProduct ? 'Save Product Changes' : 'Publish Product to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK IMPORT MODAL */}
      {isBulkImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-amber-400" />
                  Bulk Import Products Batch
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Paste a JSON array of products to add multiple catalog items at once into Supabase.
                </p>
              </div>
              <button
                onClick={() => setIsBulkImportModalOpen(false)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBulkImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">JSON Payload Array</label>
                <textarea
                  rows={10}
                  required
                  value={bulkImportJson}
                  onChange={(e) => setBulkImportJson(e.target.value)}
                  className="w-full font-mono text-xs px-3.5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-300 focus:border-amber-400 focus:outline-none"
                  placeholder="[ { name: '...', price: 1999, category: 'couples' } ]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsBulkImportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-400/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Import All Products
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
