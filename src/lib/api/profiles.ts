// src/lib/api/profiles.ts
// Manages the profiles table (linked to auth.users).
// For user management by admins, see users.ts.

import { supabase } from '../supabase'

// Get all profiles for a tenant (admin view)
export async function getProfiles(clientId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, roles(name)')
    .eq('client_id', clientId)
    .order('last_name', { ascending: true })

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

// Get a single profile by auth user ID, scoped to the tenant
export async function getProfileById(id: string, clientId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, roles(name)')
    .eq('id', id)
    .eq('client_id', clientId)
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

// Create a profile record (called after auth.signUp)
export async function createProfile(record: {
  id: string         // must match auth.users id
  client_id: string
  id_role: string
  first_name: string
  last_name: string
  phone?: string
  email?: string
}) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(record)
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

// Upload profile image to storage
export async function uploadProfileImage(
  file: File,
  userId: string,
  clientId: string
): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const filePath = `${clientId}/${userId}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    console.error(uploadError)
    throw uploadError
  }

  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

// Delete profile image from storage
export async function deleteProfileImage(imageUrl: string) {
  const path = imageUrl.replace(
    `${import.meta.env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/`,
    ''
  )
  if (!path) return

  const { error } = await supabase.storage.from('avatars').remove([path])
  if (error) {
    console.error(error)
    throw error
  }
}

// Update profile fields, always scoped to the tenant
export async function updateProfile(id: string, updates: {
  first_name?: string
  last_name?: string
  phone?: string
  email?: string
  id_role?: string
  is_active?: boolean
  image_url?: string
}, clientId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .eq('client_id', clientId)
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

// Soft-disable a profile (set is_active = false) instead of hard delete
export async function deactivateProfile(id: string, clientId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_active: false })
    .eq('id', id)
    .eq('client_id', clientId)
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

// Hard delete — use with caution, prefer deactivateProfile
export async function deleteProfile(id: string, clientId: string) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId)

  if (error) {
    console.error(error)
    throw error
  }
  return true
}
