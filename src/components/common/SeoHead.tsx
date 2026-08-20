import React, { useEffect } from 'react';
import { Product, ProductReview } from '../../types';
import {
  DEFAULT_SITE_URL,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateProductSchema,
  generateBreadcrumbSchema,
  BreadcrumbEntry
} from '../../services/seoService';

export interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  product?: Product;
  reviews?: ProductReview[];
  breadcrumbs?: BreadcrumbEntry[];
  noIndex?: boolean;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title = 'HARCONXS | Haute Joaillerie & Atelier Gifting',
  description = 'Sovereign Haute Joaillerie, 18K/Platinum heirloom commissions, bespoke romantic couple sanctuaries, and luxury artisan gifts.',
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&auto=format&fit=crop&q=80',
  ogType = 'website',
  product,
  reviews = [],
  breadcrumbs,
  noIndex = false
}) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : DEFAULT_SITE_URL;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : DEFAULT_SITE_URL;
  const canonical = canonicalUrl || (product ? `${siteUrl}/product/${product.slug}` : currentUrl);
  
  const finalTitle = product?.seoTitle || product?.metaTitle || title;
  const finalDescription = product?.seoDescription || product?.metaDescription || product?.shortDescription || description;
  const finalOgTitle = product?.ogTitle || ogTitle || finalTitle;
  const finalOgDescription = product?.ogDescription || ogDescription || finalDescription;
  const finalOgImage = product?.ogImage || product?.ogImageUrl || (product?.images && product.images[0]) || ogImage;

  // 1. Update Document Head Tags dynamically
  useEffect(() => {
    // Document Title
    const brandSuffix = finalTitle.includes('HARCONXS') ? '' : ' | HARCONXS';
    document.title = `${finalTitle}${brandSuffix}`;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(attr) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard SEO
    updateMeta('description', finalDescription);
    updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateLink('canonical', canonical);

    // OpenGraph
    updateMeta('og:title', finalOgTitle, true);
    updateMeta('og:description', finalOgDescription, true);
    updateMeta('og:image', finalOgImage, true);
    updateMeta('og:url', canonical, true);
    updateMeta('og:type', product ? 'product' : ogType, true);
    updateMeta('og:site_name', 'HARCONXS', true);
    updateMeta('og:locale', 'en_US', true);

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', finalOgTitle);
    updateMeta('twitter:description', finalOgDescription);
    updateMeta('twitter:image', finalOgImage);
    updateMeta('twitter:site', '@harconxs');
  }, [finalTitle, finalDescription, finalOgTitle, finalOgDescription, finalOgImage, canonical, noIndex, product, ogType]);

  // 2. Prepare JSON-LD Schemas
  const schemas: any[] = [
    generateOrganizationSchema(siteUrl),
    generateWebSiteSchema(siteUrl)
  ];

  if (product) {
    schemas.push(generateProductSchema(product, reviews, siteUrl));
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs, siteUrl));
  }

  return (
    <React.Fragment>
      {schemas.map((schema, index) => (
        <script
          key={`json-ld-schema-${index}-${schema['@type'] || index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </React.Fragment>
  );
};
