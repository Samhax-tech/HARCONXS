import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UserAccountDashboard } from '../components/account/UserAccountDashboard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useStore } from '../context/StoreContext';

export const AccountPage: React.FC = () => {
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { setSelectedTrackingOrderId } = useStore();

  useEffect(() => {
    if (id && pathname.includes('/account/orders/')) {
      setSelectedTrackingOrderId(id);
    }
  }, [id, pathname, setSelectedTrackingOrderId]);

  let activeTabName = 'Account Overview';
  if (pathname.includes('/orders/') && id) activeTabName = `Order #${id}`;
  else if (pathname.includes('/orders')) activeTabName = 'Orders';
  else if (pathname.includes('/wishlist')) activeTabName = 'Wishlist';
  else if (pathname.includes('/addresses')) activeTabName = 'Addresses';
  else if (pathname.includes('/reviews')) activeTabName = 'My Reviews';
  else if (pathname.includes('/custom-orders/') && id) activeTabName = `Custom Order #${id}`;
  else if (pathname.includes('/custom-orders')) activeTabName = 'Custom Orders';
  else if (pathname.includes('/couple-websites/') && id) activeTabName = `Couple Website #${id}`;
  else if (pathname.includes('/couple-websites')) activeTabName = 'Couple Websites';
  else if (pathname.includes('/support')) activeTabName = 'Support Tickets';
  else if (pathname.includes('/notifications')) activeTabName = 'Notifications & Dispatches';
  else if (pathname.includes('/settings')) activeTabName = 'Settings & Security';
  else if (pathname.includes('/invoices')) activeTabName = 'Invoices & Billing';
  else if (pathname.includes('/profile')) activeTabName = 'Profile';

  return (
    <div className="bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Customer Area' },
            { label: activeTabName }
          ]}
        />
      </div>
      <UserAccountDashboard />
    </div>
  );
};
