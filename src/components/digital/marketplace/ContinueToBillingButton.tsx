import React from 'react';
import { ExternalLink, CreditCard, ShieldCheck } from 'lucide-react';
import { redirectToBillingPortal, BillingRedirectParams, buildSafeBillingUrl } from '../../../utils/billingUtils';
import { useStore } from '../../../context/StoreContext';

interface ContinueToBillingButtonProps {
  productId?: string;
  planId?: string;
  slug?: string;
  billingCycle?: 'monthly' | 'yearly' | 'lifetime';
  source?: string;
  planName?: string;
  priceFormatted?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'compact';
  className?: string;
  children?: React.ReactNode;
}

export const ContinueToBillingButton: React.FC<ContinueToBillingButtonProps> = ({
  productId,
  planId,
  slug,
  billingCycle = 'monthly',
  source = 'harconxs_shop',
  planName,
  priceFormatted,
  variant = 'primary',
  className = '',
  children
}) => {
  const { user } = useStore();

  const params: BillingRedirectParams = {
    productId,
    planId,
    slug,
    billingCycle,
    source,
    userContext: user ? {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      userRole: user.role
    } : undefined
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    redirectToBillingPortal(params);
  };

  const safeUrl = buildSafeBillingUrl(params);

  // Variant Styles
  let baseStyle = 'inline-flex items-center justify-center font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer select-none group ';
  
  if (variant === 'primary') {
    baseStyle += 'bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-zinc-950 px-6 py-3.5 shadow-xl hover:shadow-sky-500/20 active:scale-[0.98]';
  } else if (variant === 'secondary') {
    baseStyle += 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-5 py-2.5 border border-zinc-700 hover:border-zinc-600 active:scale-[0.98]';
  } else if (variant === 'outline') {
    baseStyle += 'bg-transparent hover:bg-sky-950/40 text-sky-400 hover:text-sky-300 border border-sky-500/50 hover:border-sky-400 px-4 py-2 active:scale-[0.98]';
  } else if (variant === 'compact') {
    baseStyle += 'bg-sky-500 hover:bg-sky-400 text-zinc-950 px-3.5 py-1.5 text-xs rounded-lg active:scale-[0.98]';
  }

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`${baseStyle} ${className}`}
      title="Continue to secure billing on https://billingharconxs.vercel.app"
    >
      {children || (
        <span className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-zinc-950 shrink-0" />
          <span>
            Continue to Billing {priceFormatted ? `• ${priceFormatted}` : ''}
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-950/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      )}
    </a>
  );
};
