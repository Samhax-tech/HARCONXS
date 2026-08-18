import React from 'react';
import { useLocation } from 'react-router-dom';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const AdminPage: React.FC = () => {
  return (
    <div className="bg-zinc-950 min-h-screen">
      <AdminDashboard />
    </div>
  );
};
