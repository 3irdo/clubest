import React from 'react';
import { ReactDashboardLayout } from '../layouts/ReactDashboardLayout';
import { PaymentHistory } from '../components/payments/PaymentsHistory';

import { ROLE_NAMES } from '../context/AuthContext';

export const PaymentsApp: React.FC = () => {
  return (
    <ReactDashboardLayout currentPath="/payments" allowedRoles={[ROLE_NAMES.ADMIN, ROLE_NAMES.MEMBER]}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 md:p-8">
        <PaymentHistory />
      </div>
    </ReactDashboardLayout>
  );
};
