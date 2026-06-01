import React from 'react';
import { ReactDashboardLayout } from '../layouts/ReactDashboardLayout';
import { InventoryManagement } from '../components/admin/InventoryManagement';
import { UserManagement } from '../components/admin/UserManagement';

import { ROLE_NAMES } from '../context/AuthContext';

export const AdminApp: React.FC = () => {
  return (
    <ReactDashboardLayout currentPath="/admin" allowedRoles={[ROLE_NAMES.ADMIN]}>
      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 md:p-8">
          <InventoryManagement />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 md:p-8">
          <UserManagement />
        </div>
      </div>
    </ReactDashboardLayout>
  );
};
