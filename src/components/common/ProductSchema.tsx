import React from 'react';
import { Product } from '../types';

interface ProductSchemaProps {
  product: Product;
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({ product }) => {
  const inrPrice = Math.round(product.price * 83);
  
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.shortDescription || product.fullDescription,
    "sku": product.sku,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "HARCONXS Atelier"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://harconxs.com/product/${product.slug || product.id}`,
      "priceCurrency": "INR",
      "price": inrPrice,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "HARCONXS SHOP",
        "url": "https://harconxs.com"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toFixed(1),
      "reviewCount": Math.max(product.reviewCount || 1, 1),
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const OrganizationSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HARCONXS SHOP",
    "url": "https://harconxs.com",
    "logo": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-98200-12890",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://youtube.com/@harconxs",
      "https://instagram.com/harconxs",
      "https://t.me/harconxs"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
