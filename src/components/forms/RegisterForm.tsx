import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { withBase } from '../../lib/withBase'
import { register } from '../../lib/auth'

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone
      })
      window.location.href = withBase('dashboard')
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al registrarse')
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
        <h2 className="text-xl font-medium text-text-secondary">Crear cuenta</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        {errorMsg && (
          <p className="text-red-500 text-sm text-center">{errorMsg}</p>
        )}

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
  )
}
