import React from 'react';
import { Users, DollarSign, CircleAlert as AlertCircle, Package } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import mockData from '../../data/mockData.json';

export const DashboardStats: React.FC = () => {
  const { stats } = mockData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Usuarios activos"
        value={stats.activeUsers}
        subtitle="+10% que el mes pasado"
        icon={Users}
        color="primary"
      />
      <StatCard
        title="Pagos en el mes"
        value={`$${stats.monthlyPayments.toLocaleString()}`}
        subtitle="+5% vs el mes pasado"
        icon={DollarSign}
        color="green"
      />
      <StatCard
        title="Stock crítico"
        value={stats.lowStockProducts}
        subtitle="Productos con pocas unidades"
        icon={AlertCircle}
        color="primary"
      />
      <StatCard
        title="Entrenamientos hoy"
        value={stats.todayTrainings}
        subtitle="Grupo 1"
        icon={Package}
        color="primary"
      />
    </div>
  );
};
