import React, { useState } from 'react';
import { CreditCard as Edit, Trash2, DollarSign, Award, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { LoadingSpinner, ErrorMessage } from '../ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { getProfiles, updateProfile, deleteProfile } from '../../lib/api/profiles';
import { getPaymentsByUserId } from '../../lib/api/payments';
import { getMembershipsByUserId } from '../../lib/api/memberships';
import { createNotification } from '../../lib/api/notifications';

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: 'Efectivo',
  TRANSFER: 'Transferencia',
  CARD: 'Tarjeta',
};

const MEMBERSHIP_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activa',
  EXPIRED: 'Expirada',
  CANCELLED: 'Cancelada',
};

export const UserManagement: React.FC = () => {
  const { profile: authProfile } = useAuth();
  const clientId = authProfile?.client_id;

  const { data: users, isLoading, error, reload } = useData(
    () => clientId ? getProfiles(clientId) : Promise.resolve([]),
    [clientId]
  );

  const { data: roles } = useData(
    () => clientId
      ? import('../../lib/supabase').then(m => m.supabase.from('roles').select('*')).then(r => r.data ?? [])
      : Promise.resolve([]),
    [clientId]
  );

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [relatedUserId, setRelatedUserId] = useState<string | null>(null);

  const { data: userPayments } = useData(
    () => (relatedUserId && clientId) ? getPaymentsByUserId(relatedUserId, clientId) : Promise.resolve([]),
    [relatedUserId, clientId]
  );

  const { data: userMemberships } = useData(
    () => (relatedUserId && clientId) ? getMembershipsByUserId(relatedUserId, clientId) : Promise.resolve([]),
    [relatedUserId, clientId]
  );

  const openEdit = (user: any) => {
    setEditingUser(user);
    setSelectedRole(user.id_role ?? '');
    setSelectedStatus(user.is_active !== false);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !editingUser) return;
    setSaving(true);
    try {
      await updateProfile(editingUser.id, {
        id_role: selectedRole,
        is_active: selectedStatus,
      }, clientId);

      const newRoleName = (roles ?? []).find((r: any) => r.id_role === selectedRole)?.name ?? 'Unknown';

      createNotification({
        client_id: clientId,
        user_id: editingUser.id,
        title: 'Profile updated',
        message: `Your role has been changed to ${newRoleName} and status set to ${selectedStatus ? 'active' : 'inactive'}.`,
        type: 'info',
        link: '/profile',
      }).catch(console.error);

      setShowModal(false);
      setEditingUser(null);
      await reload();
    } catch (err: any) {
      alert('Error al actualizar usuario: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!clientId) return;
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    setDeleting(userId);
    try {
      await deleteProfile(userId, clientId);
      await reload();
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (!clientId) return <LoadingSpinner message="Cargando perfil..." />;
  if (isLoading) return <LoadingSpinner message="Cargando usuarios..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">Gestión de Usuarios</h2>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Nombre</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Teléfono</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Rol</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Estado</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-text-secondary">No hay usuarios registrados.</td></tr>
              ) : (
                (users ?? []).map((user: any) => {
                  const roleName = user.roles?.name ?? 'Sin rol';
                  const isAdmin = roleName === 'ADMIN';
                  return (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="py-4 px-4 text-text-secondary">{user.phone ?? '—'}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          isAdmin
                            ? 'bg-red-100 text-red-700'
                            : roleName === 'COACH'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {roleName}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.is_active !== false
                            ? 'bg-accent-green text-primary-dark'
                            : 'bg-gray-300 text-text-secondary'
                        }`}>
                          {user.is_active !== false ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(user)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={18} className="text-primary" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={deleting === user.id}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingUser(null); setRelatedUserId(null); }}
        title={editingUser ? `${editingUser.first_name} ${editingUser.last_name}` : ''}
        size="lg"
      >
        {editingUser && (
          <div className="space-y-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-primary">Rol</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Seleccionar rol</option>
                    {(roles ?? []).map((r: any) => (
                      <option key={r.id_role} value={r.id_role}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-primary">Estado</label>
                  <select
                    value={selectedStatus ? 'active' : 'inactive'}
                    onChange={(e) => setSelectedStatus(e.target.value === 'active')}
                    className="input-field"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingUser(null); setRelatedUserId(null); }}>
                  Cancelar
                </Button>
              </div>
            </form>

            <hr className="border-gray-200" />

            <div>
              <h4 className="text-lg font-bold text-primary-dark mb-3 flex items-center gap-2">
                <DollarSign size={20} /> Pagos
              </h4>
              <button
                type="button"
                onClick={() => setRelatedUserId(relatedUserId === editingUser.id ? null : editingUser.id)}
                className="text-sm text-primary hover:underline mb-2 inline-block"
              >
                {relatedUserId === editingUser.id ? 'Ocultar pagos' : 'Ver pagos'}
              </button>
              {relatedUserId === editingUser.id && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(userPayments ?? []).length === 0 ? (
                    <p className="text-sm text-text-secondary">Sin pagos registrados.</p>
                  ) : (
                    (userPayments ?? []).map((p: any) => (
                      <div key={p.id_payment} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
                        <span className="font-medium">{p.concept || 'Pago'}</span>
                        <span className="text-text-secondary">{PAYMENT_METHOD_LABELS[p.payment_method] || p.payment_method}</span>
                        <span className="font-semibold text-primary">${p.amount?.toFixed(2)}</span>
                        <span className="text-text-secondary text-xs">
                          {p.created_at ? new Date(p.created_at).toLocaleDateString('es-ES') : ''}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-bold text-primary-dark mb-3 flex items-center gap-2">
                <Award size={20} /> Membresías
              </h4>
              <button
                type="button"
                onClick={() => setRelatedUserId(relatedUserId === editingUser.id ? null : editingUser.id)}
                className="text-sm text-primary hover:underline mb-2 inline-block"
              >
                {relatedUserId === editingUser.id ? 'Ocultar membresías' : 'Ver membresías'}
              </button>
              {relatedUserId === editingUser.id && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(userMemberships ?? []).length === 0 ? (
                    <p className="text-sm text-text-secondary">Sin membresías registradas.</p>
                  ) : (
                    (userMemberships ?? []).map((m: any) => (
                      <div key={m.id_membership} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
                        <span className="font-medium">{m.type}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          m.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                          m.status === 'EXPIRED' ? 'bg-gray-200 text-gray-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {MEMBERSHIP_STATUS_LABELS[m.status] ?? m.status}
                        </span>
                        <span className="text-text-secondary text-xs">
                          {m.start_date ? new Date(m.start_date).toLocaleDateString('es-ES') : ''} — {m.end_date ? new Date(m.end_date).toLocaleDateString('es-ES') : ''}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
