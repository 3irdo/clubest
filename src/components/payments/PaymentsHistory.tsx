import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { LoadingSpinner, ErrorMessage } from '../ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getPayments, getPaymentsByUserId, createPayment, deletePayment } from '../../lib/api/payments';
import { getProfiles } from '../../lib/api/profiles';
import { createNotification, notifyRole } from '../../lib/api/notifications';

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'CARD', label: 'Tarjeta' },
];

export const PaymentHistory: React.FC = () => {
  const { profile, hasRole, role } = useAuth();
  const clientId = profile?.client_id;
  const userId = profile?.id;
  const isAdmin = hasRole('ADMIN');

  const { data: payments, isLoading, error, reload } = useData(
    () => {
      if (!clientId) return Promise.resolve([])
      if (isAdmin) return getPayments(clientId)
      return userId ? getPaymentsByUserId(userId, clientId) : Promise.resolve([])
    },
    [clientId, userId, isAdmin]
  );
  const { data: profiles } = useData(
    () => clientId && isAdmin ? getProfiles(clientId) : Promise.resolve([]),
    [clientId, isAdmin]
  );

  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
  const memberProfiles = (profiles ?? []).filter((p: any) => p.roles?.name === 'MEMBER');

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({
    id_user: '', amount: '', concept: '', payment_method: 'CASH'
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const methodLabel = (method: string) =>
    PAYMENT_METHODS.find(m => m.value === method)?.label ?? method;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    setSaving(true);
    try {
      const payment = await createPayment({
        id_user: isAdmin ? form.id_user : userId,
        amount: parseFloat(form.amount),
        concept: form.concept || undefined,
        payment_method: form.payment_method,
      }, clientId);

      const targetUserId = isAdmin ? form.id_user : userId;
      const amountStr = `$${parseFloat(form.amount).toFixed(2)}`;
      const conceptStr = form.concept || 'Payment';

      createNotification({
        client_id: clientId,
        user_id: targetUserId,
        title: 'Payment registered',
        message: `A payment of ${amountStr} for "${conceptStr}" has been registered.`,
        type: 'success',
        link: '/payments',
      }).catch(console.error);

      notifyRole(clientId, 'ADMIN', {
        title: 'Payment received',
        message: `Payment of ${amountStr} for "${conceptStr}" was registered.`,
        type: 'info',
        link: '/payments',
      }).catch(console.error);

      setForm({ id_user: '', amount: '', concept: '', payment_method: 'CASH' });
      setShowModal(false);
      await reload();
    } catch (err: any) {
      alert('Error al registrar pago: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!clientId) return;
    if (!window.confirm('¿Eliminar este pago?')) return;
    setDeleting(id);
    try {
      await deletePayment(id, clientId);
      await reload();
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (!clientId || isLoading) return <LoadingSpinner message="Cargando pagos..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-bold text-primary-dark">Historial de Pagos</h2>
        <Button variant="accent" onClick={() => setShowModal(true)} className="w-full sm:w-auto">
          Registrar Pago
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Usuario</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Concepto</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Método</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Monto</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Fecha</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(payments ?? []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-secondary">
                    No hay pagos registrados.
                  </td>
                </tr>
              ) : (
                (payments ?? []).map((payment: any) => (
                  <tr key={payment.id_payment} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      {payment.id_user ? (
                        <span className="text-sm font-medium">
                          {profileMap.get(payment.id_user)
                            ? `${profileMap.get(payment.id_user).first_name} ${profileMap.get(payment.id_user).last_name}`
                            : <span className="text-text-secondary">{payment.id_user.slice(0, 8)}...</span>}
                        </span>
                      ) : (
                        <span className="text-text-secondary">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">{payment.concept || 'Pago'}</td>
                    <td className="py-4 px-4">{methodLabel(payment.payment_method)}</td>
                    <td className="py-4 px-4 font-semibold text-primary">
                      ${payment.amount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-4 px-4 text-text-secondary">
                      {formatDate(payment.created_at)}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleDelete(payment.id_payment)}
                        disabled={deleting === payment.id_payment}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Registrar Pago">
        <form onSubmit={handleCreate} className="space-y-4">
          {isAdmin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-primary">
                Usuario <span className="text-red-500">*</span>
              </label>
              <select
                value={form.id_user}
                onChange={(e) => setForm({ ...form, id_user: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Seleccionar miembro</option>
                {memberProfiles.filter((p: any) => p.is_active !== false).map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Input
            label="Monto"
            type="number"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <Input
            label="Concepto"
            value={form.concept}
            onChange={(e) => setForm({ ...form, concept: e.target.value })}
            placeholder="Ej: Membresía mensual"
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">
              Método de pago <span className="text-red-500">*</span>
            </label>
            <select
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              className="input-field"
              required
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 pt-2">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Registrar Pago'}
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
