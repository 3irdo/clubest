import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { withBase } from '../../lib/withBase';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-dark mb-2">
          <span className="text-accent-green">CLUBEST</span>
        </h1>
        <h2 className="text-2xl font-semibold text-primary-dark">Crear cuenta</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="fullName"
          label="Nombre completo"
          placeholder="Juan Pérez"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <Input
          type="email"
          name="email"
          label="Correo"
          placeholder="tucorreo@gmail.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          type="tel"
          name="phone"
          label="Teléfono"
          placeholder="+34 612 345 678"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="password"
          label="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="confirmPassword"
          label="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text-secondary">
          ¿Ya tienes una cuenta?{' '}
          <a href={withBase('login')} className="text-accent-green hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
};
