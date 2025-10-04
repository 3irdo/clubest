import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import mockData from '../../data/mockData.json';

export const TrainingCalendar: React.FC = () => {
  const { trainings } = mockData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">Entrenamientos Programados</h2>
        <Button variant="accent">Nuevo Entrenamiento</Button>
      </div>

      <div className="grid gap-6">
        {trainings.map((training) => (
          <Card key={training.id}>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary-dark mb-2">
                  {training.title}
                </h3>
                <p className="text-text-secondary mb-4">{training.description}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar size={16} />
                    <span>{formatDate(training.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Clock size={16} />
                    <span>{training.duration_minutes} minutos</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Users size={16} />
                    <span>Máx. {training.max_participants} participantes</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2">
                <span
                  className={`px-4 py-2 rounded-lg text-center font-semibold ${
                    training.status === 'scheduled'
                      ? 'bg-accent-green text-primary-dark'
                      : 'bg-gray-300 text-text-secondary'
                  }`}
                >
                  {training.status === 'scheduled' ? 'Programado' : 'Cancelado'}
                </span>
                <Button variant="primary" size="sm">
                  Reservar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
