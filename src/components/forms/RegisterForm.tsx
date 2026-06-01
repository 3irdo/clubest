import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { withBase } from '../../lib/withBase'
import { register } from '../../lib/auth'
import { getClients } from '../../lib/api/clients'

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [clients, setClients] = useState<{ id_client: string; name: string }[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingClients, setLoadingClients] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    getClients()
      .then((data) => {
        setClients(data)
        if (data.length > 0) setSelectedClient(data[0].id_client)
      })
      .catch(() => setErrorMsg('Error al cargar los clubes'))
      .finally(() => setLoadingClients(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!selectedClient) {
      setErrorMsg('Selecciona un club')
      return
    }

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
        phone: formData.phone,
        clientId: selectedClient,
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Club</label>
          {loadingClients ? (
            <div className="input-field text-sm text-text-secondary flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
              Cargando clubes...
            </div>
          ) : (
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Seleccionar club</option>
              {clients.map((c) => (
                <option key={c.id_client} value={c.id_client}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

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
