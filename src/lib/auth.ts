import { supabase } from './supabase'
import { createNotification, notifyRole } from './api/notifications'

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error(error)
    throw error
  }

  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error)
    throw error
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error(error)
    throw error
  }

  return data.session
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error(error)
    throw error
  }

  return data.user
}

export async function register(userData: { email: string, password: string, fullName: string, phone: string, clientId: string }) {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  })

  if (error) {
    console.error('Signup error:', error)
    throw error
  }

  if (data.user) {
    const names = userData.fullName.trim().split(' ')
    const firstName = names[0] || ''
    const lastName = names.slice(1).join(' ') || ''

    const memberRoleId = 'f82da42a-567c-4c1d-a62b-157278502a34' // MEMBER role

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      client_id: userData.clientId,
      id_role: memberRoleId,
      first_name: firstName,
      last_name: lastName,
      phone: userData.phone,
      email: userData.email,
      is_active: true
    })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      throw profileError
    }

    // Notify new member
    createNotification({
      client_id: userData.clientId,
      user_id: data.user.id,
      title: 'Welcome to Clubest!',
      message: `Hi ${firstName}, your account is ready. Start exploring the dashboard.`,
      type: 'success',
      link: '/dashboard',
    }).catch(console.error)

    // Notify all admins
    notifyRole(userData.clientId, 'ADMIN', {
      title: 'New member registered',
      message: `${firstName} ${lastName} has joined as a new member.`,
      type: 'info',
      link: '/admin',
    }).catch(console.error)
  }

  return data
}
