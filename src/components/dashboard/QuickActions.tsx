import React from 'react';
import { Calendar, DollarSign, Package } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { withBase } from '../../lib/withBase';
import { useAuth, ROLE_NAMES } from '../../context/AuthContext';

export const QuickActions: React.FC = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole(ROLE_NAMES.ADMIN);

  return (
    <Card className="mb-8">
      <h2 className="text-2xl font-bold text-primary-dark mb-6">Accesos rápidos</h2>
      <div className="flex flex-col gap-4">
        <Button
          variant="primary"
          className="w-full flex items-center gap-3"
          onClick={() => window.location.href = withBase('training')}
        >
          <Calendar size={20} />
          <span>Crear entrenamiento</span>
        </Button>
        {isAdmin && (
          <Button
            variant="accent"
            className="w-full flex items-center gap-3"
            onClick={() => window.location.href = withBase('payments')}
          >
            <DollarSign size={20} />
            <span>Registrar pago</span>
          </Button>
        )}
        {isAdmin && (
          <Button
            variant="accent"
            className="w-full flex items-center gap-3"
            onClick={() => window.location.href = withBase('admin')}
          >
            <Package size={20} />
            <span>Añadir producto</span>
          </Button>
        )}
      </div>
    </Card>
  );
};
