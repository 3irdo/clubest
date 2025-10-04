import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import mockData from '../../data/mockData.json';

export const PaymentHistory: React.FC = () => {
  const { payments } = mockData;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Pendiente';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const statusColors = {
    confirmed: 'bg-accent-green text-primary-dark',
    pending: 'bg-yellow-400 text-primary-dark',
    rejected: 'bg-red-500 text-white'
  };

  const statusLabels = {
    confirmed: 'Confirmado',
    pending: 'Pendiente',
    rejected: 'Rechazado'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">Historial de Pagos</h2>
        <Button variant="accent">Registrar Pago</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Concepto
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Monto
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Fecha
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">{payment.concept}</td>
                  <td className="py-4 px-4 font-semibold text-primary">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-text-secondary">
                    {formatDate(payment.payment_date)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[payment.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[payment.status as keyof typeof statusLabels]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
