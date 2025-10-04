import React from 'react';
import { CreditCard as Edit, Trash2, UserPlus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import mockData from '../../data/mockData.json';

export const UserManagement: React.FC = () => {
  const { users } = mockData;

  const roleColors = {
    admin: 'bg-red-500 text-white',
    instructor: 'bg-blue-500 text-white',
    member: 'bg-green-500 text-white'
  };

  const roleLabels = {
    admin: 'Admin',
    instructor: 'Instructor',
    member: 'Miembro'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">Gestión de Usuarios</h2>
        <Button variant="accent">
          <UserPlus size={20} className="mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Nombre
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Email
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Teléfono
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Rol
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Estado
                </th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{user.full_name}</td>
                  <td className="py-4 px-4 text-text-secondary">{user.email}</td>
                  <td className="py-4 px-4 text-text-secondary">{user.phone}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        roleColors[user.role as keyof typeof roleColors]
                      }`}
                    >
                      {roleLabels[user.role as keyof typeof roleLabels]}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.membership_status === 'active'
                          ? 'bg-accent-green text-primary-dark'
                          : 'bg-gray-300 text-text-secondary'
                      }`}
                    >
                      {user.membership_status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors">
                        <Edit size={18} className="text-primary" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
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
