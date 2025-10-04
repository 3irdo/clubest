import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const ProfileInfo: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: 'Admin CLUBEST',
    email: 'admin@clubest.com',
    phone: '+34 634 567 890',
    role: 'Administrador',
    membershipStatus: 'Activo'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Perfil actualizado correctamente');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary-dark">Mi Perfil</h2>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Nombre completo"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="Rol"
              name="role"
              value={formData.role}
              disabled
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-text-primary">
              Estado de membresía:
            </span>
            <span className="px-4 py-2 bg-accent-green text-primary-dark font-semibold rounded-lg">
              {formData.membershipStatus}
            </span>
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary">
              Guardar cambios
            </Button>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-primary-dark mb-4">
          Cambiar contraseña
        </h3>
        <div className="space-y-4">
          <Input
            label="Contraseña actual"
            type="password"
          />
          <Input
            label="Nueva contraseña"
            type="password"
          />
          <Input
            label="Confirmar nueva contraseña"
            type="password"
          />
          <Button variant="primary">
            Actualizar contraseña
          </Button>
        </div>
      </Card>
    </div>
  );
};
