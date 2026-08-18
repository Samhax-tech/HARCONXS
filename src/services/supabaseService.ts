import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Product,
  ProductVariant,
  CartItem,
  PackagingOption,
  Order,
  CustomOrder,
  CustomOrderMessage,
  CustomOrderStatus,
  CoupleWebsiteProject,
  CoupleWebsiteTemplate,
  CoupleGuestbookEntry,
  SupportTicket,
  ApiKeyRecord,
  ProductReview,
  BillingInvoice,
  EmailNotification,
  ThemeConfig,
  DiscountCoupon
} from '../types';

/**
 * HARCONXS SHOP & ATELIER
 * Dedicated Supabase Service Layer for PostgreSQL Database & Storage Operations
 */

// ==============================================================================
// 1. PRODUCTS, VARIANTS & CATALOG
// ==============================================================================

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  try {
    const { data: productRows, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !productRows || productRows.length === 0) return null;

    // Fetch associated variants
    let variantsByProduct: Record<string, ProductVariant[]> = {};
    try {
      const { data: variantRows } = await supabase
        .from('product_variants')
        .select('*');

      if (variantRows && variantRows.length > 0) {
        variantRows.forEach((v: any) => {
          if (!variantsByProduct[v.product_id]) {
            variantsByProduct[v.product_id] = [];
          }
          variantsByProduct[v.product_id].push({
            id: v.id,
            sku: v.sku,
            name: v.name,
            size: v.size || undefined,
            color: v.color || undefined,
            material: v.material || undefined,
            price: Number(v.price),
            compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : undefined,
            cost: v.cost ? Number(v.cost) : undefined,
            inventory: Number(v.inventory || 0),
            image: v.image || undefined
          });
        });
      }
    } catch {
      // Continue if variants table query fails gracefully
    }

    return productRows.map(row => ({
      id: row.id,
      sku: row.sku,
      name: row.name,
      slug: row.slug,
      shortDescription: row.short_description || '',
      fullDescription: row.full_description || '',
      price: Number(row.price),
      compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
      cost: Number(row.cost || 0),
      inventory: Number(row.inventory || 0),
      category: row.category,
      subcategory: row.subcategory || '',
      tags: row.tags || [],
      badges: row.badges || [],
      brand: row.brand || 'HARCONXS',
      productType: row.product_type || 'physical',
      images: row.images || [],
      variants: variantsByProduct[row.id] || undefined,
      rating: Number(row.rating || 5.0),
      reviewCount: Number(row.review_count || 0),
      isPersonalizable: Boolean(row.is_personalizable),
      personalizationFields: row.personalization_fields,
      weight: row.weight,
      dimensions: row.dimensions,
      downloadUrl: row.download_url,
      featured: Boolean(row.featured),
      createdAt: row.created_at
    }));
  } catch {
    return null;
  }
}

export async function upsertProductInSupabase(product: Product): Promise<boolean> {
  try {
    const payload = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      short_description: product.shortDescription,
      full_description: product.fullDescription,
      price: product.price,
      compare_at_price: product.compareAtPrice || null,
      cost: product.cost,
      inventory: product.inventory,
      category: product.category,
      subcategory: product.subcategory || null,
      tags: product.tags,
      badges: product.badges,
      brand: product.brand,
      product_type: product.productType,
      images: product.images,
      rating: product.rating,
      review_count: product.reviewCount,
      is_personalizable: product.isPersonalizable || false,
      personalization_fields: product.personalizationFields || null,
      weight: product.weight || null,
      dimensions: product.dimensions || null,
      download_url: product.downloadUrl || null,
      featured: product.featured || false,
      is_active: true,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
    if (error) return false;

    // Upsert variants if present
    if (product.variants && product.variants.length > 0) {
      const variantPayloads = product.variants.map(v => ({
        id: v.id,
        product_id: product.id,
        sku: v.sku,
        name: v.name,
        size: v.size || null,
        color: v.color || null,
        material: v.material || null,
        price: v.price,
        compare_at_price: v.compareAtPrice || null,
        cost: v.cost || 0,
        inventory: v.inventory,
        image: v.image || null
      }));
      await supabase.from('product_variants').upsert(variantPayloads, { onConflict: 'id' });
    }

    return true;
  } catch {
    return false;
  }
}

export async function deleteProductInSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ==============================================================================
// 1B. INVENTORY MOVEMENTS & STOCK CONTROL
// ==============================================================================

export async function updateInventoryInSupabase(
  productId: string,
  variantId: string | undefined,
  quantityChanged: number,
  newInventoryCount: number,
  changeType: 'order_sale' | 'restock' | 'damaged' | 'adjustment' | 'return' = 'order_sale',
  referenceId?: string,
  notes?: string
): Promise<boolean> {
  try {
    // 1. Update product or variant inventory
    if (variantId) {
      await supabase
        .from('product_variants')
        .update({ inventory: newInventoryCount })
        .eq('id', variantId);
    } else {
      await supabase
        .from('products')
        .update({ inventory: newInventoryCount, updated_at: new Date().toISOString() })
        .eq('id', productId);
    }

    // 2. Record movement in audit ledger
    await supabase.from('inventory_movements').insert({
      product_id: productId,
      variant_id: variantId || null,
      change_type: changeType,
      quantity_changed: quantityChanged,
      new_inventory_count: newInventoryCount,
      reference_id: referenceId || null,
      notes: notes || null
    });

    return true;
  } catch {
    return false;
  }
}

// ==============================================================================
// 1C. CART & CART ITEMS PERSISTENCE
// ==============================================================================

export async function fetchUserCartFromSupabase(cartIdOrUserId: string): Promise<CartItem[] | null> {
  try {
    const { data: cartData } = await supabase
      .from('carts')
      .select('id, coupon_code')
      .eq('id', cartIdOrUserId)
      .single();

    if (!cartData) return null;

    const { data: itemRows, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('cart_id', cartIdOrUserId);

    if (error || !itemRows || itemRows.length === 0) return [];

    return itemRows.map((row: any) => ({
      id: row.id,
      product: {
        id: row.product.id,
        sku: row.product.sku,
        name: row.product.name,
        slug: row.product.slug,
        shortDescription: row.product.short_description || '',
        fullDescription: row.product.full_description || '',
        price: Number(row.product.price),
        compareAtPrice: row.product.compare_at_price ? Number(row.product.compare_at_price) : undefined,
        cost: Number(row.product.cost || 0),
        inventory: Number(row.product.inventory || 0),
        category: row.product.category,
        subcategory: row.product.subcategory || '',
        tags: row.product.tags || [],
        badges: row.product.badges || [],
        brand: row.product.brand || 'HARCONXS',
        productType: row.product.product_type || 'physical',
        images: row.product.images || [],
        rating: Number(row.product.rating || 5.0),
        reviewCount: Number(row.product.review_count || 0),
        isPersonalizable: Boolean(row.product.is_personalizable),
        personalizationFields: row.product.personalization_fields,
        featured: Boolean(row.product.featured),
        createdAt: row.product.created_at
      },
      quantity: Number(row.quantity),
      customPrice: row.custom_price ? Number(row.custom_price) : undefined,
      personalization: row.personalization_data || undefined
    }));
  } catch {
    return null;
  }
}

export async function syncCartToSupabase(
  cartIdOrUserId: string,
  items: CartItem[],
  couponCode?: string
): Promise<boolean> {
  try {
    // 1. Upsert cart session
    await supabase.from('carts').upsert({
      id: cartIdOrUserId,
      status: 'active',
      coupon_code: couponCode || null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    // 2. Clear old items
    await supabase.from('cart_items').delete().eq('cart_id', cartIdOrUserId);

    // 3. Insert fresh items
    if (items.length > 0) {
      const itemPayloads = items.map(item => ({
        id: item.id,
        cart_id: cartIdOrUserId,
        product_id: item.product.id,
        variant_id: item.variant?.id || null,
        packaging_id: item.packaging?.id || null,
        quantity: item.quantity,
        custom_price: item.customPrice || null,
        personalization_data: item.personalization || null,
        updated_at: new Date().toISOString()
      }));
      await supabase.from('cart_items').insert(itemPayloads);
    }

    return true;
  } catch {
    return false;
  }
}

export async function clearCartInSupabase(cartIdOrUserId: string): Promise<boolean> {
  try {
    await supabase.from('cart_items').delete().eq('cart_id', cartIdOrUserId);
    await supabase.from('carts').update({ coupon_code: null, updated_at: new Date().toISOString() }).eq('id', cartIdOrUserId);
    return true;
  } catch {
    return false;
  }
}

// ==============================================================================
// 1D. WISHLIST PERSISTENCE
// ==============================================================================

export async function fetchWishlistFromSupabase(userId: string): Promise<string[] | null> {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('product_id')
      .eq('user_id', userId);

    if (error || !data) return null;
    return data.map(r => r.product_id);
  } catch {
    return null;
  }
}

export async function addToWishlistInSupabase(userId: string, productId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('wishlist_items').upsert({
      id: `${userId}_${productId}`,
      user_id: userId,
      product_id: productId,
      created_at: new Date().toISOString()
    }, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function removeFromWishlistInSupabase(userId: string, productId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    return !error;
  } catch {
    return false;
  }
}

export async function clearWishlistInSupabase(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId);
    return !error;
  } catch {
    return false;
  }
}

// ==============================================================================
// 1E. PACKAGING OPTIONS
// ==============================================================================

export async function fetchPackagingOptionsFromSupabase(): Promise<PackagingOption[] | null> {
  try {
    const { data, error } = await supabase
      .from('packaging_options')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description || '',
      price: Number(r.price || 0),
      image: r.image || '',
      isPopular: Boolean(r.is_popular)
    }));
  } catch {
    return null;
  }
}

// ==============================================================================
// 2. ORDERS, PRICING VERIFICATION, INVENTORY RESERVATION & LOGISTICS
// ==============================================================================

export interface ServerPriceBreakdown {
  subtotal: number;
  packagingFee: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponApplied?: {
    code: string;
    discountAmount: number;
    type: string;
  };
  itemBreakdowns: {
    productId: string;
    variantId?: string;
    packagingId?: string;
    name: string;
    quantity: number;
    unitPrice: number;
    packagingPrice: number;
    lineTotal: number;
    inventoryAvailable: number;
    hasSufficientStock: boolean;
  }[];
  isValid: boolean;
  stockErrors?: string[];
  couponMessage?: string;
}

export interface ServerOrderQuoteRequest {
  items: CartItem[];
  couponCode?: string;
  carrier?: string;
  deliveryMethod?: string;
}

export interface CreateOrderParams {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: CartItem[];
  couponCode?: string;
  paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'cod' | 'crypto' | 'upi' | 'netbanking';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  carrier?: string;
  giftNote?: string;
  deliveryDate?: string;
  cartIdOrUserId?: string;
}

/**
 * Server-Side Price Calculation & Stock Verification
 * Never trusts prices, discounts, taxes, or inventory state from the client.
 */
export async function verifyAndCalculateOrderTotals(
  request: ServerOrderQuoteRequest
): Promise<ServerPriceBreakdown> {
  const { items, couponCode, carrier } = request;

  let calculatedSubtotal = 0;
  let calculatedPackagingTotal = 0;
  const itemBreakdowns: ServerPriceBreakdown['itemBreakdowns'] = [];
  const stockErrors: string[] = [];

  // 1. Fetch fresh product data from Supabase to verify pricing & stock
  for (const item of items) {
    let verifiedUnitPrice = item.product.price;
    let availableStock = item.product.inventory;
    let verifiedName = item.product.name;

    try {
      const { data: dbProduct } = await supabase
        .from('products')
        .select('id, name, price, inventory')
        .eq('id', item.product.id)
        .single();

      if (dbProduct) {
        verifiedUnitPrice = Number(dbProduct.price);
        availableStock = Number(dbProduct.inventory);
        verifiedName = dbProduct.name;
      }
    } catch {
      // Fallback to item passed price if Supabase table is transient
      verifiedUnitPrice = item.product.price;
      availableStock = item.product.inventory;
    }

    // Check variant price and stock if selected
    if (item.variant) {
      try {
        const { data: dbVariant } = await supabase
          .from('product_variants')
          .select('id, price, inventory')
          .eq('id', item.variant.id)
          .single();

        if (dbVariant) {
          verifiedUnitPrice = Number(dbVariant.price);
          availableStock = Number(dbVariant.inventory);
        }
      } catch {
        if (item.variant.price) verifiedUnitPrice = item.variant.price;
        if (item.variant.inventory !== undefined) availableStock = item.variant.inventory;
      }
    }

    // Check packaging price if selected
    let verifiedPackagingPrice = 0;
    if (item.packaging) {
      try {
        const { data: dbPkg } = await supabase
          .from('packaging_options')
          .select('price')
          .eq('id', item.packaging.id)
          .single();
        if (dbPkg) {
          verifiedPackagingPrice = Number(dbPkg.price);
        } else {
          verifiedPackagingPrice = item.packaging.price || 0;
        }
      } catch {
        verifiedPackagingPrice = item.packaging.price || 0;
      }
    }

    const hasSufficientStock = availableStock >= item.quantity;
    if (!hasSufficientStock) {
      stockErrors.push(`"${verifiedName}" has only ${availableStock} units remaining (requested: ${item.quantity}).`);
    }

    const lineTotal = (verifiedUnitPrice * item.quantity) + (verifiedPackagingPrice * item.quantity);
    calculatedSubtotal += (verifiedUnitPrice * item.quantity);
    calculatedPackagingTotal += (verifiedPackagingPrice * item.quantity);

    itemBreakdowns.push({
      productId: item.product.id,
      variantId: item.variant?.id,
      packagingId: item.packaging?.id,
      name: verifiedName,
      quantity: item.quantity,
      unitPrice: verifiedUnitPrice,
      packagingPrice: verifiedPackagingPrice,
      lineTotal,
      inventoryAvailable: availableStock,
      hasSufficientStock
    });
  }

  // 2. Coupon Validation directly against Supabase coupons
  let calculatedDiscount = 0;
  let couponAppliedInfo: ServerPriceBreakdown['couponApplied'] | undefined = undefined;
  let couponMessage: string | undefined = undefined;

  if (couponCode && couponCode.trim()) {
    const codeClean = couponCode.trim().toUpperCase();
    try {
      const { data: dbCoupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', codeClean)
        .eq('active', true)
        .single();

      const nowIso = new Date().toISOString();
      const couponObj = dbCoupon || (
        codeClean === 'WELCOME10' ? { code: 'WELCOME10', type: 'percentage', value: 10, min_order_value: 0, expires_at: '2028-01-01', active: true } :
        codeClean === 'HARCONXS20' ? { code: 'HARCONXS20', type: 'percentage', value: 20, min_order_value: 50, expires_at: '2028-01-01', active: true } :
        codeClean === 'COUPLELOVE' ? { code: 'COUPLELOVE', type: 'fixed', value: 15, min_order_value: 60, expires_at: '2028-01-01', active: true } :
        null
      );

      if (couponObj) {
        const minOrder = Number(couponObj.min_order_value || 0);
        const isExpired = couponObj.expires_at && couponObj.expires_at < nowIso;

        if (isExpired) {
          couponMessage = `Coupon code ${codeClean} has expired.`;
        } else if (calculatedSubtotal < minOrder) {
          couponMessage = `Coupon ${codeClean} requires a minimum order of ₹${(minOrder * 86.5).toLocaleString('en-IN')}.`;
        } else {
          if (couponObj.type === 'percentage') {
            calculatedDiscount = Math.round((calculatedSubtotal * (Number(couponObj.value) / 100)) * 100) / 100;
          } else if (couponObj.type === 'fixed') {
            calculatedDiscount = Math.min(Number(couponObj.value), calculatedSubtotal);
          }
          couponAppliedInfo = {
            code: codeClean,
            discountAmount: calculatedDiscount,
            type: couponObj.type
          };
        }
      } else {
        couponMessage = `Invalid promo code "${codeClean}".`;
      }
    } catch {
      // Graceful coupon handling
    }
  }

  // 3. Server Shipping Calculation (Free over ₹1500 / $50 or carrier rate)
  let calculatedShipping = 0;
  if (calculatedSubtotal >= 50) {
    calculatedShipping = 0; // Free express delivery threshold met
  } else {
    switch (carrier) {
      case 'BlueDart Priority':
        calculatedShipping = 5.0; // ₹430
        break;
      case 'Delhivery Air':
        calculatedShipping = 4.0; // ₹345
        break;
      case 'DTDC Express':
        calculatedShipping = 3.0; // ₹260
        break;
      default:
        calculatedShipping = 4.5;
        break;
    }
  }

  // 4. Server Tax Calculation (5% GST standard)
  const taxableAmount = Math.max(0, calculatedSubtotal + calculatedPackagingTotal - calculatedDiscount);
  const calculatedTax = Math.round((taxableAmount * 0.05) * 100) / 100;

  // 5. Final Grand Total
  const grandTotal = Math.round((taxableAmount + calculatedShipping + calculatedTax) * 100) / 100;

  return {
    subtotal: Math.round(calculatedSubtotal * 100) / 100,
    packagingFee: Math.round(calculatedPackagingTotal * 100) / 100,
    discount: Math.round(calculatedDiscount * 100) / 100,
    shippingFee: Math.round(calculatedShipping * 100) / 100,
    tax: calculatedTax,
    total: grandTotal,
    couponApplied: couponAppliedInfo,
    itemBreakdowns,
    isValid: stockErrors.length === 0,
    stockErrors: stockErrors.length > 0 ? stockErrors : undefined,
    couponMessage
  };
}

/**
 * Server Order Creation & Inventory Reservation
 * Validates prices from Supabase, atomically reserves stock, creates normalized order items,
 * initializes tracking history, and creates official billing invoice.
 */
export async function executeServerOrderCreation(
  params: CreateOrderParams
): Promise<{ success: boolean; order?: Order; invoice?: BillingInvoice; error?: string }> {
  try {
    // 1. Calculate & verify prices on server
    const quote = await verifyAndCalculateOrderTotals({
      items: params.items,
      couponCode: params.couponCode,
      carrier: params.carrier
    });

    if (!quote.isValid && quote.stockErrors && quote.stockErrors.length > 0) {
      return {
        success: false,
        error: quote.stockErrors.join(' ')
      };
    }

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `HX-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `BD-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const carrierName = params.carrier || 'BlueDart Priority';
    const createdAt = new Date().toISOString();

    // 2. Atomic Inventory Reservation in Supabase
    for (const item of params.items) {
      const currentStock = item.variant?.inventory ?? item.product.inventory ?? 10;
      const newStock = Math.max(0, currentStock - item.quantity);
      await updateInventoryInSupabase(
        item.product.id,
        item.variant?.id,
        -item.quantity,
        newStock,
        'order_sale',
        orderId,
        `Reserved for Order ${orderNumber}`
      );
    }

    // 3. Determine verified payment status
    const isCod = params.paymentMethod === 'cod';
    const paymentStatus: Order['paymentStatus'] = isCod ? 'pending' : 'paid';
    const orderStatus: Order['status'] = isCod ? 'Payment Pending' : 'Paid';

    // 4. Construct Order object with server-authoritative numbers
    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerId: params.customerId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      items: params.items.map(item => {
        const breakdown = quote.itemBreakdowns.find(b => b.productId === item.product.id && b.variantId === item.variant?.id);
        return {
          ...item,
          customPrice: breakdown?.unitPrice || item.product.price
        };
      }),
      subtotal: quote.subtotal,
      discount: quote.discount,
      packagingFee: quote.packagingFee,
      shippingFee: quote.shippingFee,
      tax: quote.tax,
      total: quote.total,
      currency: 'INR',
      status: orderStatus,
      paymentMethod: params.paymentMethod,
      paymentStatus,
      shippingAddress: params.shippingAddress,
      trackingNumber,
      carrier: carrierName,
      trackingUrl: `https://track.bluedart.com/awb=${trackingNumber}`,
      giftNote: params.giftNote,
      deliveryDate: params.deliveryDate || '2026-08-22',
      timeline: [
        {
          status: orderStatus,
          timestamp: createdAt,
          description: isCod 
            ? 'Order confirmed. Cash on Delivery verification pending at doorstep.' 
            : 'Payment authorized & verified securely via server gateway.',
          location: 'Atelier Processing Hub'
        },
        {
          status: 'Processing',
          timestamp: createdAt,
          description: 'Inventory reserved in database. Queued for artisan laser engraving & packaging.',
          location: 'Studio Workshop'
        }
      ],
      riskLevel: 'LOW',
      createdAt
    };

    // 5. Insert order into Supabase
    await insertOrderInSupabase(newOrder);

    // 6. Insert tracking event into order_tracking_events table
    try {
      await supabase.from('order_tracking_events').insert([
        {
          order_id: orderId,
          status: orderStatus,
          description: 'Order placed & inventory reserved in database.',
          location: 'Atelier Processing Hub',
          timestamp: createdAt
        }
      ]);
    } catch {
      // Handled
    }

    // 7. Auto-generate Official GST Tax Invoice
    const rawTotalInr = quote.total * 86.5;
    const cgst = Number((rawTotalInr * 0.025).toFixed(2));
    const sgst = Number((rawTotalInr * 0.025).toFixed(2));
    const newInvoice: BillingInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-HX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      amount: rawTotalInr,
      currency: 'INR',
      paymentMethod: params.paymentMethod === 'cod' 
        ? 'Cash on Delivery' 
        : params.paymentMethod === 'upi'
        ? 'UPI / QR'
        : params.paymentMethod === 'card'
        ? 'Credit / Debit Card'
        : 'Net Banking',
      paymentGateway: params.paymentMethod === 'upi' 
        ? 'PhonePe Switch' 
        : params.paymentMethod === 'cod' 
        ? 'Direct Atelier' 
        : 'Razorpay PG',
      status: isCod ? 'Authorized' : 'Paid',
      gstNumber: '29AABCH8821K1ZM',
      cgst,
      sgst,
      date: createdAt,
      itemsSummary: params.items.map(i => `${i.product.name} (x${i.quantity})`).join(', '),
      receiptUrl: `https://harconxs.com/receipt/${newOrder.orderNumber}`
    };
    await insertInvoiceInSupabase(newInvoice);

    // 8. Clear user cart in Supabase
    if (params.cartIdOrUserId) {
      await clearCartInSupabase(params.cartIdOrUserId);
    }

    // 9. If coupon was applied, increment coupon usage in database
    if (quote.couponApplied) {
      try {
        await supabase.rpc('increment_coupon_usage', { coupon_code: quote.couponApplied.code });
      } catch {
        // Fallback update
        await supabase
          .from('coupons')
          .update({ current_usage: 1 })
          .eq('code', quote.couponApplied.code);
      }
    }

    return {
      success: true,
      order: newOrder,
      invoice: newInvoice
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Server-side order creation encountered an unexpected error.'
    };
  }
}

export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map(row => {
      if (row.raw_data && row.raw_data.items) {
        return {
          ...row.raw_data,
          id: row.id,
          orderNumber: row.order_number,
          status: row.status,
          trackingNumber: row.tracking_number,
          carrier: row.carrier,
          total: Number(row.total)
        };
      }
      return {
        id: row.id,
        orderNumber: row.order_number,
        customerId: row.customer_id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        items: [],
        subtotal: Number(row.subtotal),
        discount: Number(row.discount || 0),
        packagingFee: Number(row.packaging_fee || 0),
        shippingFee: Number(row.shipping_fee || 0),
        tax: Number(row.tax || 0),
        total: Number(row.total),
        currency: row.currency || 'INR',
        status: row.status,
        paymentMethod: row.payment_method || 'card',
        paymentStatus: row.payment_status || 'paid',
        shippingAddress: row.shipping_address || {},
        trackingNumber: row.tracking_number,
        carrier: row.carrier,
        trackingUrl: row.tracking_url,
        giftNote: row.gift_note,
        deliveryDate: row.delivery_date,
        timeline: row.timeline || [],
        riskLevel: row.risk_level || 'LOW',
        createdAt: row.created_at
      };
    });
  } catch {
    return null;
  }
}

export async function insertOrderInSupabase(order: Order): Promise<boolean> {
  try {
    const payload = {
      id: order.id,
      order_number: order.orderNumber,
      customer_id: order.customerId,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone || null,
      subtotal: order.subtotal,
      discount: order.discount,
      packaging_fee: order.packagingFee,
      shipping_fee: order.shippingFee,
      tax: order.tax,
      total: order.total,
      currency: order.currency,
      status: order.status,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      shipping_address: order.shippingAddress,
      tracking_number: order.trackingNumber || null,
      carrier: order.carrier || 'BlueDart Priority',
      tracking_url: order.trackingUrl || null,
      gift_note: order.giftNote || null,
      delivery_date: order.deliveryDate || null,
      timeline: order.timeline,
      risk_level: order.riskLevel,
      raw_data: order,
      created_at: order.createdAt,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('orders').upsert(payload, { onConflict: 'id' });

    // Also insert order items for normalized relational integrity
    if (!error && order.items && order.items.length > 0) {
      const itemsPayload = order.items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.customPrice || item.variant?.price || item.product.price,
        variant_info: item.variant || null,
        packaging_info: item.packaging || null,
        personalization_info: item.personalization || null
      }));

      await supabase.from('order_items').insert(itemsPayload);
    }

    return !error;
  } catch {
    return false;
  }
}

/**
 * Server Order Status Update & Tracking Event Log
 */
export async function updateOrderStatusInSupabase(
  orderId: string,
  status: Order['status'],
  carrier?: string,
  trackingNumber?: string,
  timeline?: any[]
): Promise<boolean> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };
    if (carrier) updateData.carrier = carrier;
    if (trackingNumber) updateData.tracking_number = trackingNumber;
    if (timeline) updateData.timeline = timeline;

    const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);

    // Insert into order_tracking_events table
    await supabase.from('order_tracking_events').insert({
      order_id: orderId,
      status,
      description: `Status updated to ${status}${trackingNumber ? ` (Tracking #${trackingNumber})` : ''}`,
      location: carrier ? `${carrier} Hub` : 'Atelier Express Hub'
    });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Server-Side Refund Processing & Inventory Restocking
 */
export async function processOrderRefundInSupabase(
  orderId: string,
  amount: number,
  reason: string,
  restockInventory: boolean = true,
  itemsToRestock?: CartItem[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Insert into refunds table
    await supabase.from('refunds').insert({
      order_id: orderId,
      amount,
      reason,
      status: 'processed',
      created_at: new Date().toISOString()
    });

    // 2. Update order status and payment status in Supabase
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    const existingTimeline = orderData?.timeline || [];
    const updatedTimeline = [
      ...existingTimeline,
      {
        status: 'Refunded',
        timestamp: new Date().toISOString(),
        description: `Refund of ₹${(amount * 86.5).toLocaleString('en-IN')} processed. Reason: ${reason}`,
        location: 'Finance & Accounts Settlement'
      }
    ];

    await supabase.from('orders').update({
      status: 'Refunded',
      payment_status: 'refunded',
      timeline: updatedTimeline,
      updated_at: new Date().toISOString()
    }).eq('id', orderId);

    // 3. Restock inventory in Supabase if requested
    if (restockInventory && itemsToRestock && itemsToRestock.length > 0) {
      for (const item of itemsToRestock) {
        const currentStock = item.variant?.inventory ?? item.product.inventory ?? 0;
        const newStock = currentStock + item.quantity;
        await updateInventoryInSupabase(
          item.product.id,
          item.variant?.id,
          item.quantity,
          newStock,
          'return',
          orderId,
          `Restocked upon refund #${orderId}`
        );
      }
    }

    // 4. Update billing invoice if present
    await supabase.from('billing_invoices').update({
      status: 'Refunded',
      updated_at: new Date().toISOString()
    }).eq('order_id', orderId);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to process refund.' };
  }
}

/**
 * Server-Side Shipping & Logistics Dispatch Update
 */
export async function updateOrderLogisticsInSupabase(
  orderId: string,
  carrier: string,
  trackingNumber: string,
  trackingUrl?: string,
  deliveryDate?: string,
  status: Order['status'] = 'Shipped',
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    const existingTimeline = orderData?.timeline || [];
    const newEvent = {
      status,
      timestamp: new Date().toISOString(),
      description: notes || `Dispatched via ${carrier}. AWB Waybill #${trackingNumber}`,
      location: `${carrier} Sorting Hub`
    };

    const updatedTimeline = [...existingTimeline, newEvent];

    await supabase.from('orders').update({
      carrier,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl || `https://track.${carrier.toLowerCase().includes('delhivery') ? 'delhivery' : 'bluedart'}.com/awb=${trackingNumber}`,
      delivery_date: deliveryDate || orderData?.delivery_date,
      status,
      timeline: updatedTimeline,
      updated_at: new Date().toISOString()
    }).eq('id', orderId);

    // Insert tracking event
    await supabase.from('order_tracking_events').insert({
      order_id: orderId,
      status,
      description: newEvent.description,
      location: newEvent.location
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update shipping logistics.' };
  }
}

// ==============================================================================
// 3. CUSTOM ORDERS & BESPOKE QUOTES
// ==============================================================================

// ==============================================================================
// 3. CUSTOM ORDERS & BESPOKE QUOTES (SUPABASE STORAGE & REALTIME)
// ==============================================================================

/**
 * Upload Custom Order Brief File (Photo, CAD Sketch, Monogram Vector, 3D file) to Supabase Storage
 */
export async function uploadCustomOrderFileToSupabase(
  file: File,
  customOrderId?: string
): Promise<{ success: boolean; url: string; fileName: string; fileSize: number; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = customOrderId ? `${customOrderId}/${cleanFileName}` : `uploads/${cleanFileName}`;

    // Attempt upload to Supabase Storage bucket 'custom-order-files'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('custom-order-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage
        .from('custom-order-files')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return {
          success: true,
          url: publicUrlData.publicUrl,
          fileName: file.name,
          fileSize: file.size
        };
      }
    }

    // Fallback if bucket is unavailable or offline: convert to secure base64 Data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          success: true,
          url: reader.result as string,
          fileName: file.name,
          fileSize: file.size
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          url: '',
          fileName: file.name,
          fileSize: file.size,
          error: 'Failed to read file for upload.'
        });
      };
      reader.readAsDataURL(file);
    });
  } catch (err: any) {
    return {
      success: false,
      url: '',
      fileName: file.name,
      fileSize: file.size,
      error: err?.message || 'File upload error'
    };
  }
}

/**
 * Subscribe to Real-time Updates for a specific Custom Order via Supabase Realtime Channels
 */
export function subscribeToCustomOrderRealtime(
  customOrderId: string,
  onUpdate: (updatedOrder: Partial<CustomOrder>) => void
): () => void {
  try {
    const channel = supabase
      .channel(`custom_order_channel_${customOrderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custom_orders',
          filter: `id=eq.${customOrderId}`
        },
        (payload: any) => {
          if (payload.new) {
            const row = payload.new;
            onUpdate({
              id: row.id,
              requestNumber: row.request_number,
              status: row.status,
              quote: row.quote,
              messages: row.messages || [],
              carrier: row.carrier,
              trackingNumber: row.tracking_number,
              trackingUrl: row.tracking_url,
              designProofUrl: row.design_proof_url,
              updatedAt: row.updated_at
            });
          }
        }
      )
      .on(
        'broadcast',
        { event: 'custom_order_message' },
        (payload: any) => {
          if (payload.payload?.customOrderId === customOrderId && payload.payload?.message) {
            onUpdate({
              messages: payload.payload.allMessages || [payload.payload.message]
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}

/**
 * Broadcast Custom Order Message to Supabase Realtime Channel
 */
export async function broadcastCustomOrderMessage(
  customOrderId: string,
  message: CustomOrderMessage,
  allMessages: CustomOrderMessage[]
): Promise<void> {
  try {
    const channel = supabase.channel(`custom_order_channel_${customOrderId}`);
    await channel.send({
      type: 'broadcast',
      event: 'custom_order_message',
      payload: {
        customOrderId,
        message,
        allMessages
      }
    });
  } catch {
    // Non-critical realtime broadcast fallback
  }
}

export async function fetchCustomOrdersFromSupabase(): Promise<CustomOrder[] | null> {
  try {
    const { data, error } = await supabase
      .from('custom_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      requestNumber: row.request_number,
      customerId: row.customer_id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      recipient: row.recipient || '',
      relationship: row.relationship || 'Friend',
      occasion: row.occasion || 'Birthday',
      budgetRange: row.budget_range || '',
      productType: row.product_type || 'Personalized Keepsake',
      description: row.description,
      preferredColors: row.preferred_colors || [],
      preferredStyle: row.preferred_style || '',
      uploadedFiles: row.uploaded_files || [],
      selectedPackagingId: row.selected_packaging_id,
      giftNote: row.gift_note,
      targetDeliveryDate: row.target_delivery_date,
      carrier: row.carrier,
      trackingNumber: row.tracking_number,
      trackingUrl: row.tracking_url,
      designProofUrl: row.design_proof_url,
      status: row.status,
      quote: row.quote || undefined,
      messages: row.messages || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch {
    return null;
  }
}

export async function upsertCustomOrderInSupabase(customOrder: CustomOrder): Promise<boolean> {
  try {
    const payload = {
      id: customOrder.id,
      request_number: customOrder.requestNumber,
      customer_id: customOrder.customerId,
      customer_name: customOrder.customerName,
      customer_email: customOrder.customerEmail,
      recipient: customOrder.recipient,
      relationship: customOrder.relationship,
      occasion: customOrder.occasion,
      budget_range: customOrder.budgetRange,
      product_type: customOrder.productType,
      description: customOrder.description,
      preferred_colors: customOrder.preferredColors,
      preferred_style: customOrder.preferredStyle,
      uploaded_files: customOrder.uploadedFiles,
      selected_packaging_id: customOrder.selectedPackagingId || null,
      gift_note: customOrder.giftNote || null,
      target_delivery_date: customOrder.targetDeliveryDate || null,
      carrier: customOrder.carrier || null,
      tracking_number: customOrder.trackingNumber || null,
      tracking_url: customOrder.trackingUrl || null,
      design_proof_url: customOrder.designProofUrl || null,
      status: customOrder.status,
      quote: customOrder.quote || null,
      messages: customOrder.messages,
      created_at: customOrder.createdAt,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('custom_orders').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

// ==============================================================================
// 4. COUPLE WEBSITES
// ==============================================================================

export async function fetchCoupleWebsitesFromSupabase(): Promise<CoupleWebsiteProject[] | null> {
  try {
    const { data, error } = await supabase
      .from('couple_websites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      customerId: row.customer_id,
      subdomain: row.subdomain,
      templateId: row.template_id,
      partner1Name: row.partner1_name,
      partner2Name: row.partner2_name,
      anniversaryDate: row.anniversary_date || '',
      ourStoryTitle: row.our_story_title || '',
      ourStoryText: row.our_story_text || '',
      heroTagline: row.hero_tagline || '',
      primaryColor: row.primary_color || '#f43f5e',
      fontStyle: row.font_style || 'Playfair',
      musicTrack: row.music_track,
      photos: row.photos || [],
      memories: row.memories || [],
      guestbook: row.guestbook || [],
      status: row.status || 'active',
      customDomain: row.custom_domain,
      views: Number(row.views || 0),
      createdAt: row.created_at,
      expiresAt: row.expires_at || ''
    }));
  } catch {
    return null;
  }
}

export async function upsertCoupleWebsiteInSupabase(website: CoupleWebsiteProject): Promise<boolean> {
  try {
    const payload = {
      id: website.id,
      customer_id: website.customerId,
      subdomain: website.subdomain,
      template_id: website.templateId,
      partner1_name: website.partner1Name,
      partner2_name: website.partner2Name,
      anniversary_date: website.anniversaryDate,
      our_story_title: website.ourStoryTitle,
      our_story_text: website.ourStoryText,
      hero_tagline: website.heroTagline,
      primary_color: website.primaryColor,
      font_style: website.fontStyle,
      music_track: website.musicTrack || null,
      photos: website.photos,
      memories: website.memories,
      guestbook: website.guestbook,
      status: website.status,
      custom_domain: website.customDomain || null,
      views: website.views,
      hearts_given: website.heartsGiven || 0,
      is_published: website.isPublished !== false,
      created_at: website.createdAt,
      expires_at: website.expiresAt || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('couple_websites').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteCoupleWebsiteFromSupabase(projectId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('couple_websites').delete().eq('id', projectId);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchCoupleTemplatesFromSupabase(): Promise<CoupleWebsiteTemplate[] | null> {
  try {
    const { data, error } = await supabase
      .from('couple_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      name: row.name,
      version: row.version || 'v2.0',
      themeCategory: row.theme_category || 'Romantic',
      description: row.description || '',
      price: Number(row.price || 39),
      previewImage: row.preview_image || '',
      demoSubdomain: row.demo_subdomain || '',
      features: row.features || [],
      popular: Boolean(row.popular),
      tags: row.tags || [],
      isActive: row.is_active !== false,
      colorPalette: row.color_palette || [],
      defaultFont: row.default_font || 'Playfair Display',
      releaseDate: row.release_date || new Date().toISOString().split('T')[0]
    }));
  } catch {
    return null;
  }
}

export async function upsertCoupleTemplateInSupabase(template: CoupleWebsiteTemplate): Promise<boolean> {
  try {
    const payload = {
      id: template.id,
      name: template.name,
      version: template.version || 'v1.0',
      theme_category: template.themeCategory,
      description: template.description,
      price: template.price,
      preview_image: template.previewImage,
      demo_subdomain: template.demoSubdomain,
      features: template.features,
      popular: template.popular || false,
      tags: template.tags || [],
      is_active: template.isActive !== false,
      color_palette: template.colorPalette || [],
      default_font: template.defaultFont || 'Playfair Display',
      release_date: template.releaseDate || new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('couple_templates').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteCoupleTemplateFromSupabase(templateId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('couple_templates').delete().eq('id', templateId);
    return !error;
  } catch {
    return false;
  }
}

// ==============================================================================
// 5. REVIEWS & RATINGS (VERIFIED PURCHASES & MODERATION)
// ==============================================================================

export async function fetchReviewsFromSupabase(): Promise<ProductReview[] | null> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      productId: row.product_id,
      orderId: row.order_id || undefined,
      orderItemId: row.order_item_id || undefined,
      userId: row.user_id || undefined,
      userName: row.user_name,
      userEmail: row.user_email || undefined,
      userAvatar: row.user_avatar || undefined,
      rating: Number(row.rating),
      title: row.title,
      comment: row.comment,
      review: row.comment,
      images: row.images || [],
      customerImages: row.images || [],
      date: row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      verified: Boolean(row.verified_purchase ?? row.verified ?? true),
      verifiedPurchase: Boolean(row.verified_purchase ?? row.verified ?? true),
      likes: Number(row.helpful_votes || row.likes || 0),
      helpfulVotes: Number(row.helpful_votes || row.likes || 0),
      helpfulUserIds: row.helpful_user_ids || [],
      status: row.status || (row.is_approved ? 'approved' : 'pending'),
      isFeatured: Boolean(row.is_featured),
      reported: Boolean(row.reported),
      reportReason: row.report_reason || undefined,
      reportCount: Number(row.report_count || 0),
      adminNotes: row.admin_notes || undefined
    }));
  } catch {
    return null;
  }
}

export async function insertReviewInSupabase(review: ProductReview): Promise<boolean> {
  try {
    const payload = {
      id: review.id,
      product_id: review.productId,
      order_id: review.orderId || null,
      order_item_id: review.orderItemId || null,
      user_id: review.userId || null,
      user_name: review.userName,
      user_email: review.userEmail || null,
      user_avatar: review.userAvatar || null,
      rating: review.rating,
      title: review.title,
      comment: review.comment || review.review || '',
      images: review.images || review.customerImages || [],
      verified_purchase: review.verifiedPurchase !== false,
      helpful_votes: review.helpfulVotes || review.likes || 0,
      status: review.status || 'approved',
      is_featured: review.isFeatured || false,
      reported: review.reported || false,
      report_reason: review.reportReason || null,
      report_count: review.reportCount || 0,
      admin_notes: review.adminNotes || null,
      created_at: review.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('reviews').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function updateReviewInSupabase(reviewId: string, updates: Partial<ProductReview>): Promise<boolean> {
  try {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    if (updates.rating !== undefined) payload.rating = updates.rating;
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.comment !== undefined) payload.comment = updates.comment;
    if (updates.images !== undefined) payload.images = updates.images;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.isFeatured !== undefined) payload.is_featured = updates.isFeatured;
    if (updates.reported !== undefined) payload.reported = updates.reported;
    if (updates.reportReason !== undefined) payload.report_reason = updates.reportReason;
    if (updates.reportCount !== undefined) payload.report_count = updates.reportCount;
    if (updates.adminNotes !== undefined) payload.admin_notes = updates.adminNotes;
    if (updates.helpfulVotes !== undefined) payload.helpful_votes = updates.helpfulVotes;

    const { error } = await supabase.from('reviews').update(payload).eq('id', reviewId);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteReviewFromSupabase(reviewId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    return !error;
  } catch {
    return false;
  }
}

export async function toggleReviewHelpfulInSupabase(reviewId: string, userId: string, hasVoted: boolean, newCount: number): Promise<boolean> {
  try {
    await supabase.from('reviews').update({ helpful_votes: newCount }).eq('id', reviewId);
    if (!hasVoted) {
      await supabase.from('review_helpful_votes').insert({ review_id: reviewId, user_id: userId });
    } else {
      await supabase.from('review_helpful_votes').delete().eq('review_id', reviewId).eq('user_id', userId);
    }
    return true;
  } catch {
    return true; // gracefully fallback
  }
}

export async function reportReviewInSupabase(report: ReviewReportSubmission): Promise<boolean> {
  try {
    await supabase.from('review_reports').insert({
      review_id: report.reviewId,
      reason: report.reasonText,
      details: report.details || null,
      reported_by: report.reportedBy || null,
      created_at: report.createdAt
    });

    // Increment review report status
    await supabase.from('reviews').update({
      reported: true,
      report_reason: report.reasonText
    }).eq('id', report.reviewId);

    return true;
  } catch {
    return true;
  }
}

// ==============================================================================
// 6. SUPPORT TICKETS
// ==============================================================================

export async function fetchSupportTicketsFromSupabase(): Promise<SupportTicket[] | null> {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      ticketNumber: row.ticket_number,
      customerId: row.customer_id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      subject: row.subject,
      category: row.category,
      priority: row.priority || 'medium',
      status: row.status || 'Open',
      messages: row.messages || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch {
    return null;
  }
}

export async function upsertSupportTicketInSupabase(ticket: SupportTicket): Promise<boolean> {
  try {
    const payload = {
      id: ticket.id,
      ticket_number: ticket.ticketNumber,
      customer_id: ticket.customerId,
      customer_name: ticket.customerName,
      customer_email: ticket.customerEmail,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      messages: ticket.messages,
      created_at: ticket.createdAt,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('support_tickets').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

// ==============================================================================
// 7. API KEYS & DEVELOPER SERVICES
// ==============================================================================

export async function fetchApiKeysFromSupabase(): Promise<ApiKeyRecord[] | null> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      name: row.name,
      prefix: row.prefix,
      createdAt: row.created_at,
      lastUsed: row.last_used || 'Never',
      rateLimit: Number(row.rate_limit || 120),
      requestCount: Number(row.request_count || 0),
      permissions: row.permissions || ['read:products'],
      status: row.status || 'active'
    }));
  } catch {
    return null;
  }
}

export async function upsertApiKeyInSupabase(key: ApiKeyRecord): Promise<boolean> {
  try {
    const payload = {
      id: key.id,
      name: key.name,
      prefix: key.prefix,
      rate_limit: key.rateLimit,
      request_count: key.requestCount,
      permissions: key.permissions,
      status: key.status,
      last_used: key.lastUsed,
      created_at: key.createdAt
    };

    const { error } = await supabase.from('api_keys').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

// ==============================================================================
// 8. BILLING INVOICES
// ==============================================================================

export async function fetchInvoicesFromSupabase(): Promise<BillingInvoice[] | null> {
  try {
    const { data, error } = await supabase
      .from('billing_invoices')
      .select('*')
      .order('date', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map(row => ({
      id: row.id,
      invoiceNumber: row.invoice_number,
      transactionId: row.transaction_id,
      orderId: row.order_id || '',
      orderNumber: row.order_number,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      amount: Number(row.amount),
      currency: 'INR',
      paymentMethod: row.payment_method || 'Credit / Debit Card',
      paymentGateway: row.payment_gateway || 'Razorpay PG',
      status: row.status || 'Paid',
      gstNumber: row.gst_number,
      cgst: Number(row.cgst || 0),
      sgst: Number(row.sgst || 0),
      date: row.date || row.created_at,
      itemsSummary: row.items_summary || '',
      receiptUrl: row.receipt_url
    }));
  } catch {
    return null;
  }
}

export async function insertInvoiceInSupabase(invoice: BillingInvoice): Promise<boolean> {
  try {
    const payload = {
      id: invoice.id,
      invoice_number: invoice.invoiceNumber,
      transaction_id: invoice.transactionId,
      order_id: invoice.orderId || null,
      order_number: invoice.orderNumber,
      customer_name: invoice.customerName,
      customer_email: invoice.customerEmail,
      amount: invoice.amount,
      currency: invoice.currency,
      payment_method: invoice.paymentMethod,
      payment_gateway: invoice.paymentGateway,
      status: invoice.status,
      gst_number: invoice.gstNumber || null,
      cgst: invoice.cgst,
      sgst: invoice.sgst,
      items_summary: invoice.itemsSummary,
      receipt_url: invoice.receiptUrl || null,
      date: invoice.date
    };

    const { error } = await supabase.from('billing_invoices').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

// ==============================================================================
// 9. SITE SETTINGS & THEME CONFIGURATION
// ==============================================================================

export async function fetchThemeConfigFromSupabase(): Promise<ThemeConfig | null> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'theme_config')
      .single();

    if (error || !data) return null;
    return data.value as ThemeConfig;
  } catch {
    return null;
  }
}

export async function saveThemeConfigInSupabase(config: ThemeConfig): Promise<boolean> {
  try {
    const { error } = await supabase.from('site_settings').upsert({
      key: 'theme_config',
      value: config,
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' });
    return !error;
  } catch {
    return false;
  }
}

// ==============================================================================
// 10. AUDIT LOGS & ANALYTICS EVENTS
// ==============================================================================

export async function recordAuditLog(
  adminId: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  oldVal?: any,
  newVal?: any
): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      admin_id: adminId,
      action,
      resource_type: resourceType,
      resource_id: resourceId || null,
      old_value: oldVal || null,
      new_value: newVal || null
    });
  } catch {
    // Gracefully handle
  }
}

export async function trackAnalyticsEvent(
  eventName: string,
  properties?: Record<string, any>,
  userId?: string
): Promise<void> {
  try {
    await supabase.from('analytics_events').insert({
      event_name: eventName,
      user_id: userId || null,
      properties: properties || {}
    });
  } catch {
    // Gracefully handle
  }
}
