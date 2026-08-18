import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryType } from '../../types';

export interface BreadcrumbItem {
  label: string;
  view?: string;
  category?: CategoryType | 'all';
  productId?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const { setCurrentView, setSelectedCategory, setSelectedProductId } = useStore();

  const handleClick = (item: BreadcrumbItem) => {
    if (item.category !== undefined) {
      setSelectedCategory(item.category);
    }
    if (item.productId !== undefined) {
      setSelectedProductId(item.productId);
    }
    if (item.view) {
      setCurrentView(item.view);
    }
  };

  // Generate BreadcrumbList Schema for SEO / Structured Data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://harconxs.com/"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": `https://harconxs.com/#${item.view || 'catalog'}`
      }))
    ]
  };

  return (
    <nav aria-label="Breadcrumb" className={`py-2 text-xs select-none ${className}`}>
      {/* Hidden JSON-LD for Search Engine Schema Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <ol className="flex items-center flex-wrap gap-1.5 text-zinc-400 dark:text-zinc-500">
        <li className="flex items-center">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('home');
            }}
            className="flex items-center gap-1 hover:text-amber-500 dark:hover:text-amber-400 transition-colors text-zinc-500 dark:text-zinc-400 cursor-pointer"
            title="Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </button>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-zinc-600 shrink-0" />
              {isLast ? (
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => handleClick(item)}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-zinc-600 dark:text-zinc-400 cursor-pointer truncate max-w-[140px]"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
