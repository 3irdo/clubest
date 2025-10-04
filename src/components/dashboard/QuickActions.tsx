import React from 'react';
import { Calendar, DollarSign, Package } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const QuickActions: React.FC = () => {
  return (
    <Card className="mb-8">
      <h2 className="text-2xl font-bold text-primary-dark mb-6">Accesos rápidos</h2>
      <div className="flex flex-col gap-4">
        <Button
          variant="primary"
          className="w-50 justify-start flex items-center gap-3"
          onClick={() => window.location.href = '/entrenamientos'}
        >
          <Calendar size={20} />
          <span>Crear entrenamiento</span>
        </Button>
        <Button
          variant="accent"
          className="w-full justify-start flex items-center gap-3"
          onClick={() => window.location.href = '/pagos'}
        >
          <DollarSign size={20} />
          <span>Registrar pago</span>
        </Button>
        <Button
          variant="accent"
          className="w-full justify-start flex items-center gap-3"
          onClick={() => window.location.href = '/admin'}
        >
          <Package size={20} />
          <span>Añadir producto</span>
        </Button>
      </div>
    </Card>
  );
};
