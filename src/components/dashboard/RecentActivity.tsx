import React from 'react';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getPayments } from '../../lib/api/payments';

export const RecentActivity: React.FC = () => {
  const { profile } = useAuth();
  const clientId = profile?.client_id;

  const { data: payments, isLoading } = useData(
    () => clientId ? getPayments(clientId) : Promise.resolve([]),
    [clientId]
  );

  if (!clientId || isLoading) return <LoadingSpinner message="Cargando actividad..." />;

  // Show the last 5 payments as recent activity
  const recent = (payments ?? []).slice(0, 5);

  return (
    <Card>
      <h2 className="text-2xl font-bold text-primary-dark mb-6">Actividad reciente</h2>
      {recent.length === 0 ? (
        <p className="text-text-secondary text-sm py-4">No hay actividad reciente.</p>
      ) : (
        <div className="space-y-4">
          {recent.map((payment: any) => (
            <div
              key={payment.id_payment}
              className="bg-secondary bg-opacity-20 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-primary-dark">
                    {payment.concept ?? 'Pago registrado'}
                  </p>
                  <p className="text-text-secondary text-sm">
                    ${payment.amount?.toLocaleString()} — {payment.payment_method}
                  </p>
                </div>
                <span className="text-xs text-text-secondary">
                  {payment.created_at
                    ? new Date(payment.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                    : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
