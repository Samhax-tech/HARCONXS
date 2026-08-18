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
  if (pathname.includes('/orders')) activeTabName = 'My Orders';
  if (pathname.includes('/wishlist')) activeTabName = 'Wishlist';
  if (pathname.includes('/custom-orders')) activeTabName = 'Custom Commissions';
  if (pathname.includes('/couple-websites')) activeTabName = 'Couple Websites';
  if (pathname.includes('/support')) activeTabName = 'Support Tickets';
  if (pathname.includes('/notifications')) activeTabName = 'Notifications';
  if (pathname.includes('/profile') || pathname.includes('/security')) activeTabName = 'Security & Profile';

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
