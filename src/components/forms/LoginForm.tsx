import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-dark mb-2">
          <span className="text-accent-green">CLUBEST</span>
        </h1>
        <h2 className="text-2xl font-semibold text-primary-dark">Iniciar sesión</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          label="Correo"
          placeholder="tucorreo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando...' : 'Iniciar'}
        </Button>
      </form>

      <div className="mt-6">
        <p className="text-center text-text-secondary mb-4">
          Otras opciones de ingreso
        </p>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border-2 border-gray-300 text-text-primary py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <span className="font-semibold">G</span>
          <span>Inicia sesión con Google</span>
        </button>
      </div>

      <div className="mt-6 text-center space-y-2">
        <p className="text-text-secondary">
          ¿Olvidaste tu contraseña?{' '}
          <a href="/recuperar" className="text-accent-green hover:underline">
            recuperar contraseña
          </a>
        </p>
        <p className="text-text-secondary">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-accent-green hover:underline">
            Registrarse
          </a>
        </p>
      </div>
    </div>
  );
};
