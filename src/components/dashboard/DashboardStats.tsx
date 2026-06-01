import React from 'react';
import { Users, DollarSign, CircleAlert as AlertCircle, Package } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { LoadingSpinner, ErrorMessage } from '../ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getUsers } from '../../lib/api/users';
import { getProducts } from '../../lib/api/products';
import { getPayments } from '../../lib/api/payments';
import { getTrainings } from '../../lib/api/trainings';

export const DashboardStats: React.FC = () => {
  const { profile } = useAuth();
  const clientId = profile?.client_id;

  const { data: users, isLoading: l1 } = useData(
    () => clientId ? getUsers(clientId) : Promise.resolve([]),
    [clientId]
  );
  const { data: products, isLoading: l2 } = useData(
    () => clientId ? getProducts(clientId) : Promise.resolve([]),
    [clientId]
  );
  const { data: payments, isLoading: l3 } = useData(
    () => clientId ? getPayments(clientId) : Promise.resolve([]),
    [clientId]
  );
  const { data: trainings, isLoading: l4 } = useData(
    () => clientId ? getTrainings(clientId) : Promise.resolve([]),
    [clientId]
  );

  if (!clientId) return <LoadingSpinner message="Cargando perfil..." />;
  if (l1 || l2 || l3 || l4) return <LoadingSpinner message="Cargando estadísticas..." />;

  const activeUsers = (users ?? []).filter((u: any) => u.is_active !== false).length;
  const monthlyPayments = (payments ?? []).reduce((sum: number, p: any) => sum + (p.amount ?? 0), 0);
  const lowStock = (products ?? []).filter((p: any) => p.stock < 10).length;

  // Count trainings scheduled for today
  const today = new Date().toISOString().split('T')[0];
  const todayTrainings = (trainings ?? []).filter((t: any) => t.date === today).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Usuarios activos"
        value={activeUsers}
        subtitle={`${(users ?? []).length} totales`}
        icon={Users}
        color="primary"
      />
      <StatCard
        title="Pagos en el mes"
        value={`$${monthlyPayments.toLocaleString()}`}
        subtitle={`${(payments ?? []).length} transacciones`}
        icon={DollarSign}
        color="green"
      />
      <StatCard
        title="Stock crítico"
        value={lowStock}
        subtitle="Productos con pocas unidades"
        icon={AlertCircle}
        color="primary"
      />
      <StatCard
        title="Entrenamientos hoy"
        value={todayTrainings}
        subtitle={`${(trainings ?? []).length} programados en total`}
        icon={Package}
        color="primary"
      />
    </div>
  );
};
