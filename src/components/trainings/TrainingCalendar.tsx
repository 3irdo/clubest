import React, { useState } from 'react';
import { Calendar, Clock, Users, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { LoadingSpinner, ErrorMessage } from '../ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getTrainings, createTraining, deleteTraining } from '../../lib/api/trainings';
import { getProfiles } from '../../lib/api/profiles';
import { createNotification, notifyRole } from '../../lib/api/notifications';

export const TrainingCalendar: React.FC = () => {
  const { profile, hasRole } = useAuth();
  const clientId = profile?.client_id;
  const canManage = hasRole('ADMIN') || hasRole('COACH');

  const { data: trainings, isLoading, error, reload } = useData(
    () => clientId ? getTrainings(clientId) : Promise.resolve([]),
    [clientId]
  );
  const { data: profiles } = useData(
    () => clientId ? getProfiles(clientId) : Promise.resolve([]),
    [clientId]
  );

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: '', time: '', capacity: '', coach_id: ''
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    setSaving(true);
    try {
      await createTraining({
        date: form.date,
        time: form.time,
        capacity: parseInt(form.capacity),
        coach_id: form.coach_id || undefined,
        status: 'SCHEDULED'
      }, clientId);

      const dateFormatted = new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (form.coach_id) {
        createNotification({
          client_id: clientId,
          user_id: form.coach_id,
          title: 'Training assigned',
          message: `You have a training scheduled for ${dateFormatted} at ${form.time}.`,
          type: 'info',
          link: '/training',
        }).catch(console.error);
      }

      notifyRole(clientId, 'MEMBER', {
        title: 'New training available',
        message: `A new training has been scheduled for ${dateFormatted} at ${form.time}. Reserve your spot!`,
        type: 'info',
        link: '/training',
      }).catch(console.error);

      setForm({ date: '', time: '', capacity: '', coach_id: '' });
      setShowModal(false);
      await reload();
    } catch (err: any) {
      alert('Error al crear entrenamiento: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!clientId) return;
    if (!window.confirm('¿Eliminar este entrenamiento?')) return;
    setDeleting(id);
    try {
      await deleteTraining(id, clientId);
      await reload();
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (!clientId || isLoading) return <LoadingSpinner message="Cargando entrenamientos..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-bold text-primary-dark">Entrenamientos Programados</h2>
        {canManage && (
          <Button variant="accent" onClick={() => setShowModal(true)} className="w-full sm:w-auto">
            Nuevo Entrenamiento
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {(trainings ?? []).length === 0 ? (
          <p className="text-text-secondary">No hay entrenamientos programados.</p>
        ) : (
          (trainings ?? []).map((training: any) => (
            <Card key={training.id_training}>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary-dark mb-2">
                    Entrenamiento {formatDate(training.date)} — {training.time}
                  </h3>
                  <p className="text-text-secondary mb-4">
                    {training.profiles
                      ? `Entrenador: ${training.profiles.first_name} ${training.profiles.last_name}`
                      : 'Sin entrenador asignado'}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Calendar size={16} />
                      <span>{formatDate(training.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Clock size={16} />
                      <span>{training.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Users size={16} />
                      <span>Máx. {training.capacity} participantes</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2">
                  <span
                    className={`px-4 py-2 rounded-lg text-center font-semibold ${
                      training.status === 'SCHEDULED' || !training.status
                        ? 'bg-accent-green text-primary-dark'
                        : training.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-300 text-text-secondary'
                    }`}
                  >
                    {training.status === 'SCHEDULED' || !training.status
                      ? 'Programado'
                      : training.status === 'COMPLETED'
                      ? 'Completado'
                      : 'Cancelado'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm">
                      Reservar
                    </Button>
                    {canManage && (
                      <button
                        onClick={() => handleDelete(training.id_training)}
                        disabled={deleting === training.id_training}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Entrenamiento">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Fecha"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <Input
            label="Hora"
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
          />
          <Input
            label="Capacidad máxima"
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">Entrenador</label>
            <select
              value={form.coach_id}
              onChange={(e) => setForm({ ...form, coach_id: e.target.value })}
              className="input-field"
            >
              <option value="">Sin entrenador</option>
              {(profiles ?? []).filter((p: any) => p.is_active !== false).map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 pt-2">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Crear Entrenamiento'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
