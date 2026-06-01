import React from 'react';
import { ReactDashboardLayout } from '../layouts/ReactDashboardLayout';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentActivity } from '../components/dashboard/RecentActivity';

import { ROLE_NAMES } from '../context/AuthContext';

export const DashboardApp: React.FC = () => {
  return (
    <ReactDashboardLayout currentPath="/dashboard" allowedRoles={[ROLE_NAMES.ADMIN, ROLE_NAMES.COACH, ROLE_NAMES.MEMBER]}>
      <div className="space-y-8">
        <DashboardStats />
        <QuickActions />
        <RecentActivity />
      </div>
    </ReactDashboardLayout>
  );
};
