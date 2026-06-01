import React from 'react';
import { ReactDashboardLayout } from '../layouts/ReactDashboardLayout';
import { DocumentManager } from '../components/documents/DocumentManager';

import { ROLE_NAMES } from '../context/AuthContext';

export const DocumentsApp: React.FC = () => {
  return (
    <ReactDashboardLayout currentPath="/documents" allowedRoles={[ROLE_NAMES.ADMIN, ROLE_NAMES.COACH, ROLE_NAMES.MEMBER]}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 md:p-8">
        <DocumentManager />
      </div>
    </ReactDashboardLayout>
  );
};
