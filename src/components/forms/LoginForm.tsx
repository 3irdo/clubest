import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { withBase } from '../../lib/withBase'
import { login } from '../../lib/auth'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      await login(email, password)
      window.location.href = withBase('dashboard')
    } catch (err: any) {
      setErrorMsg(err.message || 'Correo o contraseña incorrectos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-50 rounded-2xl shadow-sm border border-gray-100/50 p-8 md:p-10 w-full max-w-md">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary-dark mb-2 tracking-tight">
          <span className="text-accent-green">CLUBEST</span>
        </h1>
        <h2 className="text-xl font-medium text-text-secondary">Iniciar sesión</h2>
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

        {errorMsg && (
          <p className="text-red-500 text-sm text-center">{errorMsg}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando...' : 'Iniciar'}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <p className="text-text-secondary">
          ¿Olvidaste tu contraseña?{' '}
          <a href={withBase('recuperar')} className="text-accent-green hover:underline">
            recuperar contraseña
          </a>
        </p>
        <p className="text-text-secondary">
          ¿No tienes una cuenta?{' '}
          <a href={withBase('register')} className="text-accent-green hover:underline">
            Registrarse
          </a>
        </p>
      </div>
    </div>
  )
}
