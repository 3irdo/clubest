import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, uploadProfileImage } from '../../lib/api/profiles';
import { supabase } from '../../lib/supabase';

export const ProfileInfo: React.FC = () => {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password change state
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name ?? '',
        last_name: profile.last_name ?? '',
        phone: profile.phone ?? ''
      });
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      await updateProfile(profile.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone
      }, profile.client_id);

      await refreshProfile();
      setMessage('Perfil actualizado correctamente');
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwords.newPass !== passwords.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (passwords.newPass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSaving(true);
    try {
      const { error: passError } = await supabase.auth.updateUser({
        password: passwords.newPass
      });
      if (passError) throw passError;
      setMessage('Contraseña actualizada correctamente');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Error al cambiar contraseña');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    setUploadingImage(true)
    setMessage('')
    setError('')

    try {
      const imageUrl = await uploadProfileImage(file, profile.id, profile.client_id)
      await updateProfile(profile.id, { image_url: imageUrl }, profile.client_id)
      await refreshProfile()
      setMessage('Imagen de perfil actualizada correctamente')
    } catch (err: any) {
      console.error(err)
      setError(err.message ?? 'Error al subir imagen')
    } finally {
      setUploadingImage(false)
    }
  }

  if (isLoading || !profile) return <LoadingSpinner message="Cargando perfil..." />;

  const roleName = profile.roles?.name ?? 'Sin rol';
  const fullName = `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
  const firstNameLetter = (profile.first_name ?? '?').charAt(0).toUpperCase()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary-dark">Mi Perfil</h2>

      {message && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <Card>
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
          <div className="relative group">
            {profile.image_url ? (
              <img
                src={profile.image_url}
                alt={fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-accent-green"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary border-4 border-accent-green flex items-center justify-center text-white text-3xl font-bold">
                {firstNameLetter}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera size={24} className="text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {uploadingImage && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary-dark text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                Subiendo...
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary-dark">{fullName}</h3>
            <p className="text-sm text-text-secondary capitalize">{roleName.toLowerCase()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Nombre"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <Input
              label="Apellido"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={user?.email ?? ''}
              disabled
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
              value={roleName}
              disabled
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-text-primary">
              Estado:
            </span>
            <span className={`px-4 py-2 font-semibold rounded-lg ${
              profile.is_active !== false
                ? 'bg-accent-green text-primary-dark'
                : 'bg-gray-300 text-text-secondary'
            }`}>
              {profile.is_active !== false ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-primary-dark mb-4">
          Cambiar contraseña
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Nueva contraseña"
            type="password"
            value={passwords.newPass}
            onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
          />
          <Input
            label="Confirmar nueva contraseña"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          />
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Actualizando...' : 'Actualizar contraseña'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
