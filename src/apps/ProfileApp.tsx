import React from 'react';
import { ReactDashboardLayout } from '../layouts/ReactDashboardLayout';
import { ProfileInfo } from '../components/profile/ProfileInfo';

import { ROLE_NAMES } from '../context/AuthContext';

export const ProfileApp: React.FC = () => {
  return (
    <ReactDashboardLayout currentPath="/profile" allowedRoles={[ROLE_NAMES.ADMIN, ROLE_NAMES.COACH, ROLE_NAMES.MEMBER]}>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 md:p-8">
        <ProfileInfo />
      </div>
    </ReactDashboardLayout>
  );
};
