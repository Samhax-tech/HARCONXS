import { Product, ProductReview, CategoryType } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';
import { fetchProductsFromSupabase } from './supabaseService';

/**
 * PRODUCTION SEO & GOOGLE MERCHANT CENTER SERVICE
 * HARCONXS Haute Joaillerie & Atelier Gifting
 */

export const DEFAULT_SITE_URL = typeof window !== 'undefined' && window.location.origin
  ? window.location.origin
  : 'https://harconxs.com';

export const DEFAULT_CURRENCY = 'INR';

/**
 * Clean plain text for XML & JSON-LD escaping
 */
export function escapeXml(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function stripHtml(str: string | undefined | null): string {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * 1. STRUCTURED DATA SCHEMAS (JSON-LD)
 */

export function generateOrganizationSchema(siteUrl: string = DEFAULT_SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    'name': 'HARCONXS',
    'legalName': 'HARCONXS Luxury Atelier & Sanctuary Technologies Pvt. Ltd.',
    'url': siteUrl,
    'logo': `${siteUrl}/logo.png`,
    'description': 'Master artisanal 18K/Platinum fine jewelry atelier, bespoke custom CAD heirloom commissions, and private romantic couple sanctuaries.',
    'founders': [
      {
        '@type': 'Person',
        'name': 'Hamza Shahid'
      }
    ],
    'foundingDate': '2022',
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'telephone': '+91-80-4892-3000',
        'contactType': 'customer service',
        'email': 'concierge@harconxs.com',
        'areaServed': ['IN', 'US', 'GB', 'AE', 'SG'],
        'availableLanguage': ['English', 'Hindi']
      }
    ],
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Atelier Pavilion, UB City, Vittal Mallya Road',
      'addressLocality': 'Bengaluru',
      'addressRegion': 'Karnataka',
      'postalCode': '560001',
      'addressCountry': 'IN'
    },
    'sameAs': [
      'https://instagram.com/harconxs',
      'https://youtube.com/@harconxs',
      'https://t.me/harconxs',
      'https://discord.gg/harconxs'
    ]
  };
}

export function generateWebSiteSchema(siteUrl: string = DEFAULT_SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    'url': siteUrl,
    'name': 'HARCONXS Haute Joaillerie & Atelier Gifting',
    'description': 'Handcrafted luxury jewelry, personalized couple sanctuaries, and bespoke artisan creations.',
    'publisher': {
      '@id': `${siteUrl}/#organization`
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateProductSchema(
  product: Product,
  reviews: ProductReview[] = [],
  siteUrl: string = DEFAULT_SITE_URL,
  currency: string = DEFAULT_CURRENCY
) {
  const canonical = product.canonicalUrl || `${siteUrl}/product/${product.slug}`;
  const productReviews = reviews.filter(r => r.productId === product.id && (r.status === 'approved' || !r.status));
  
  // Aggregate rating computation
  const ratingValue = product.rating || 5.0;
  const reviewCount = Math.max(product.reviewCount || 0, productReviews.length || 1);

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${canonical}#product`,
    'name': product.seoTitle || product.name,
    'description': stripHtml(product.seoDescription || product.shortDescription || product.fullDescription),
    'image': product.images && product.images.length > 0 ? product.images : [`${siteUrl}/placeholder-jewelry.jpg`],
    'sku': product.sku,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || 'HARCONXS'
    },
    'category': product.subcategory ? `${product.category} > ${product.subcategory}` : product.category,
    'offers': {
      '@type': 'Offer',
      '@id': `${canonical}#offer`,
      'url': canonical,
      'priceCurrency': currency,
      'price': product.price.toFixed(2),
      'priceValidUntil': '2028-12-31',
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': product.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'HARCONXS Atelier'
      },
      'shippingDetails': {
        '@type': 'OfferShippingDetails',
        'shippingRate': {
          '@type': 'MonetaryAmount',
          'value': '0',
          'currency': currency
        },
        'shippingDestination': {
          '@type': 'DefinedRegion',
          'addressCountry': 'IN'
        },
        'deliveryTime': {
          '@type': 'ShippingDeliveryTime',
          'transitTime': {
            '@type': 'QuantitativeValue',
            'minValue': 2,
            'maxValue': 5,
            'unitCode': 'd'
          }
        }
      }
    }
  };

  if (product.gtin || product.barcode) {
    schema['gtin'] = product.gtin || product.barcode;
  }
  if (product.mpn || product.sku) {
    schema['mpn'] = product.mpn || product.sku;
  }

  // Aggregate Rating
  schema['aggregateRating'] = {
    '@type': 'AggregateRating',
    'ratingValue': ratingValue.toFixed(1),
    'reviewCount': reviewCount,
    'bestRating': '5',
    'worstRating': '1'
  };

  // Structured Reviews
  if (productReviews.length > 0) {
    schema['review'] = productReviews.slice(0, 5).map(rev => ({
      '@type': 'Review',
      'author': {
        '@type': 'Person',
        'name': rev.userName || 'Verified Patron'
      },
      'datePublished': rev.date ? new Date(rev.date).toISOString().split('T')[0] : '2025-01-01',
      'reviewBody': stripHtml(rev.comment || rev.review || rev.title),
      'name': rev.title || 'Exceptional Craftsmanship',
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': String(rev.rating || 5),
        'bestRating': '5',
        'worstRating': '1'
      }
    }));
  }

  return schema;
}

export function generateOfferSchema(product: Product, siteUrl: string = DEFAULT_SITE_URL, currency: string = DEFAULT_CURRENCY) {
  const canonical = product.canonicalUrl || `${siteUrl}/product/${product.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    'url': canonical,
    'priceCurrency': currency,
    'price': product.price.toFixed(2),
    'priceValidUntil': '2028-12-31',
    'itemCondition': 'https://schema.org/NewCondition',
    'availability': product.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    'seller': {
      '@type': 'Organization',
      'name': 'HARCONXS'
    }
  };
}

export function generateReviewSchema(review: ProductReview, product?: Product, siteUrl: string = DEFAULT_SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    'itemReviewed': {
      '@type': 'Product',
      'name': product?.name || 'HARCONXS Bespoke Creation',
      'image': product?.images?.[0] || `${siteUrl}/logo.png`
    },
    'author': {
      '@type': 'Person',
      'name': review.userName || 'Verified Patron'
    },
    'reviewRating': {
      '@type': 'Rating',
      'ratingValue': review.rating,
      'bestRating': 5,
      'worstRating': 1
    },
    'name': review.title,
    'reviewBody': stripHtml(review.comment || review.review),
    'datePublished': review.date ? new Date(review.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  };
}

export interface BreadcrumbEntry {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(entries: BreadcrumbEntry[], siteUrl: string = DEFAULT_SITE_URL) {
  const allItems: BreadcrumbEntry[] = [
    { name: 'Home', url: siteUrl },
    ...entries.map(e => ({
      name: e.name,
      url: e.url.startsWith('http') ? e.url : `${siteUrl}${e.url.startsWith('/') ? '' : '/'}${e.url}`
    }))
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': allItems.map((item, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': item.name,
      'item': item.url
    }))
  };
}

/**
 * 2. SITEMAP.XML GENERATOR
 */
export function generateSitemapXml(
  products: Product[] = INITIAL_PRODUCTS,
  categoriesOrSiteUrl: { slug: string; name: string }[] | string = [],
  siteUrlParam: string = DEFAULT_SITE_URL
): string {
  const siteUrl = typeof categoriesOrSiteUrl === 'string' ? categoriesOrSiteUrl : (siteUrlParam || DEFAULT_SITE_URL);
  const categories = Array.isArray(categoriesOrSiteUrl) ? categoriesOrSiteUrl : [];
  const lastMod = new Date().toISOString().split('T')[0];


  const staticPages = [
    { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${siteUrl}/shop`, priority: '0.9', changefreq: 'daily' },
    { loc: `${siteUrl}/categories`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteUrl}/custom-products`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteUrl}/couple-websites`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteUrl}/bot-panels`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteUrl}/deals`, priority: '0.8', changefreq: 'daily' },
    { loc: `${siteUrl}/best-sellers`, priority: '0.8', changefreq: 'daily' },
    { loc: `${siteUrl}/new-arrivals`, priority: '0.8', changefreq: 'daily' },
    { loc: `${siteUrl}/about`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${siteUrl}/contact`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${siteUrl}/faq`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${siteUrl}/reviews`, priority: '0.7', changefreq: 'daily' },
    { loc: `${siteUrl}/terms`, priority: '0.4', changefreq: 'yearly' },
    { loc: `${siteUrl}/privacy-policy`, priority: '0.4', changefreq: 'yearly' },
    { loc: `${siteUrl}/refund-policy`, priority: '0.4', changefreq: 'yearly' },
    { loc: `${siteUrl}/shipping-policy`, priority: '0.4', changefreq: 'yearly' }
  ];

  const categorySlugs = [
    'men', 'women', 'unisex', 'couples', 'custom', 'digital'
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // 1. Static Pages
  staticPages.forEach(p => {
    xml += `  <url>
    <loc>${escapeXml(p.loc)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
  });

  // 2. Category Pages
  categorySlugs.forEach(cat => {
    xml += `  <url>
    <loc>${escapeXml(`${siteUrl}/category/${cat}`)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // 3. Dynamic Products with Image Sitemaps
  products.forEach(prod => {
    const canonical = prod.canonicalUrl || `${siteUrl}/product/${prod.slug}`;
    xml += `  <url>
    <loc>${escapeXml(canonical)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
`;
    if (prod.images && prod.images.length > 0) {
      prod.images.slice(0, 4).forEach(img => {
        xml += `    <image:image>
      <image:loc>${escapeXml(img)}</image:loc>
      <image:title>${escapeXml(prod.seoTitle || prod.name)}</image:title>
      <image:caption>${escapeXml(prod.shortDescription)}</image:caption>
    </image:image>
`;
      });
    }
    xml += `  </url>
`;
  });

  xml += `</urlset>`;
  return xml;
}

/**
 * 3. ROBOTS.TXT GENERATOR
 */
export function generateRobotsTxt(siteUrl: string = DEFAULT_SITE_URL): string {
  return `# HARCONXS Robots.txt Directive
# Autogenerated for Search Engine Crawlers

User-agent: *
Allow: /
Allow: /shop
Allow: /product/
Allow: /category/
Allow: /categories
Allow: /custom-products
Allow: /couple-websites
Allow: /bot-panels
Allow: /about
Allow: /contact
Allow: /faq
Allow: /reviews
Allow: /terms
Allow: /privacy-policy

# Administrative & Protected Area Disallows
Disallow: /admin
Disallow: /admin/*
Disallow: /edit-page
Disallow: /edit-page/*
Disallow: /account
Disallow: /account/*
Disallow: /checkout
Disallow: /order-success
Disallow: /api/v1/internal/*
Disallow: /hax-portal

# Disallow Scraping & Telemetry
User-agent: GPTBot
Disallow: /admin/
Disallow: /account/

User-agent: CCBot
Disallow: /admin/

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml
`;
}

/**
 * 4. GOOGLE MERCHANT CENTER FEED GENERATOR (XML / RSS 2.0)
 * Compliant with Google Merchant Center Product Data Specification
 */
export function generateGoogleMerchantCenterFeedXml(
  products: Product[] = INITIAL_PRODUCTS,
  siteUrl: string = DEFAULT_SITE_URL,
  currency: string = DEFAULT_CURRENCY
): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>HARCONXS Haute Joaillerie &amp; Atelier Gifting</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Official Google Merchant Center Product Feed for HARCONXS luxury fine jewelry, bespoke CAD creations, and couple sanctuary gifts.</description>
`;

  products.forEach(prod => {
    const canonicalLink = prod.canonicalUrl || `${siteUrl}/product/${prod.slug}`;
    const mainImage = (prod.images && prod.images[0]) || `${siteUrl}/placeholder.jpg`;
    const additionalImages = (prod.images && prod.images.slice(1, 10)) || [];
    
    // Availability
    const availability = prod.inventory > 0 ? 'in_stock' : 'out_of_stock';
    
    // Google Product Category mapping
    let gpc = prod.googleProductCategory;
    if (!gpc) {
      if (prod.category === 'couples') {
        gpc = 'Apparel &amp; Accessories &gt; Jewelry &gt; Rings';
      } else if (prod.subcategory?.toLowerCase().includes('necklace') || prod.name.toLowerCase().includes('necklace') || prod.name.toLowerCase().includes('pendant')) {
        gpc = 'Apparel &amp; Accessories &gt; Jewelry &gt; Necklaces';
      } else if (prod.subcategory?.toLowerCase().includes('earring') || prod.name.toLowerCase().includes('earring')) {
        gpc = 'Apparel &amp; Accessories &gt; Jewelry &gt; Earrings';
      } else if (prod.subcategory?.toLowerCase().includes('bracelet') || prod.name.toLowerCase().includes('bracelet')) {
        gpc = 'Apparel &amp; Accessories &gt; Jewelry &gt; Bracelets';
      } else {
        gpc = 'Apparel &amp; Accessories &gt; Jewelry';
      }
    }

    const brand = prod.brand || 'HARCONXS';
    const condition = prod.condition || 'new';
    const gtin = prod.gtin || prod.barcode;
    const mpn = prod.mpn || prod.sku;
    const title = prod.seoTitle || prod.name;
    const description = stripHtml(prod.seoDescription || prod.shortDescription || prod.fullDescription);

    xml += `    <item>
      <g:id>${escapeXml(prod.sku || prod.id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(canonicalLink)}</g:link>
      <g:image_link>${escapeXml(mainImage)}</g:image_link>
`;

    additionalImages.forEach(img => {
      xml += `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>\n`;
    });

    xml += `      <g:availability>${availability}</g:availability>
      <g:price>${prod.price.toFixed(2)} ${currency}</g:price>
`;

    if (prod.compareAtPrice && prod.compareAtPrice > prod.price) {
      xml += `      <g:sale_price>${prod.price.toFixed(2)} ${currency}</g:sale_price>\n`;
    }

    xml += `      <g:condition>${condition}</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>
`;

    if (gtin) {
      xml += `      <g:gtin>${escapeXml(gtin)}</g:gtin>\n`;
    } else {
      xml += `      <g:identifier_exists>no</g:identifier_exists>\n`;
    }

    if (mpn) {
      xml += `      <g:mpn>${escapeXml(mpn)}</g:mpn>\n`;
    }

    xml += `      <g:google_product_category>${gpc}</g:google_product_category>
      <g:product_type>${escapeXml(`Fine Jewelry &gt; ${prod.category} &gt; ${prod.subcategory || 'Bespoke'}`)}</g:product_type>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Insured BlueDart Express</g:service>
        <g:price>0.00 ${currency}</g:price>
      </g:shipping>
      <g:custom_label_0>${escapeXml(prod.category)}</g:custom_label_0>
      <g:custom_label_1>${prod.isPersonalizable ? 'Personalized' : 'Standard'}</g:custom_label_1>
      <g:custom_label_2>${prod.featured ? 'Featured' : 'Regular'}</g:custom_label_2>
    </item>
`;
  });

  xml += `  </channel>
</rss>`;
  return xml;
}

/**
 * 5. GOOGLE MERCHANT CENTER TAB-SEPARATED VALUES (TSV) EXPORT
 */
export function generateGoogleMerchantCenterFeedTsv(
  products: Product[] = INITIAL_PRODUCTS,
  siteUrl: string = DEFAULT_SITE_URL,
  currency: string = DEFAULT_CURRENCY
): string {
  const headers = [
    'id',
    'title',
    'description',
    'link',
    'image_link',
    'availability',
    'price',
    'condition',
    'brand',
    'gtin',
    'mpn',
    'google_product_category',
    'product_type'
  ];

  const rows = products.map(p => {
    const link = p.canonicalUrl || `${siteUrl}/product/${p.slug}`;
    const img = p.images?.[0] || '';
    const avail = p.inventory > 0 ? 'in_stock' : 'out_of_stock';
    const priceStr = `${p.price.toFixed(2)} ${currency}`;
    const title = (p.seoTitle || p.name).replace(/\t|\n/g, ' ');
    const desc = stripHtml(p.seoDescription || p.shortDescription).replace(/\t|\n/g, ' ');
    const gpc = p.googleProductCategory || 'Apparel & Accessories > Jewelry';

    return [
      p.sku || p.id,
      title,
      desc,
      link,
      img,
      avail,
      priceStr,
      p.condition || 'new',
      p.brand || 'HARCONXS',
      p.gtin || p.barcode || '',
      p.mpn || p.sku,
      gpc,
      `Jewelry > ${p.category}`
    ].join('\t');
  });

  return [headers.join('\t'), ...rows].join('\n');
}

/**
 * Fetch and build feeds dynamically from Supabase database (or fallback safely)
 */
export async function getLiveMerchantFeedXml(siteUrl: string = DEFAULT_SITE_URL): Promise<string> {
  try {
    const dbProducts = await fetchProductsFromSupabase();
    const activeProducts = (dbProducts && dbProducts.length > 0) ? dbProducts : INITIAL_PRODUCTS;
    return generateGoogleMerchantCenterFeedXml(activeProducts, siteUrl);
  } catch {
    return generateGoogleMerchantCenterFeedXml(INITIAL_PRODUCTS, siteUrl);
  }
}

export async function getLiveSitemapXml(siteUrl: string = DEFAULT_SITE_URL): Promise<string> {
  try {
    const dbProducts = await fetchProductsFromSupabase();
    const activeProducts = (dbProducts && dbProducts.length > 0) ? dbProducts : INITIAL_PRODUCTS;
    return generateSitemapXml(activeProducts, [], siteUrl);
  } catch {
    return generateSitemapXml(INITIAL_PRODUCTS, [], siteUrl);
  }
}

// Convenient Aliases
export const generateProductJsonLd = generateProductSchema;
export const generateOrganizationJsonLd = generateOrganizationSchema;
export const generateWebSiteJsonLd = generateWebSiteSchema;
export const generateReviewJsonLd = generateReviewSchema;
export const generateBreadcrumbListJsonLd = generateBreadcrumbSchema;

