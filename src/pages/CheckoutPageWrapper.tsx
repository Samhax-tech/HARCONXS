import React from 'react';
import { CheckoutPage } from '../components/checkout/CheckoutPage';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CheckoutPageWrapper: React.FC = () => {
  return (
    <div className="bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: 'Bag', view: 'cart' }, { label: 'Secure Atelier Checkout' }]} />
      </div>
      <CheckoutPage />
    </div>
  );
};
