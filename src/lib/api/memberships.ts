import { supabase } from '../supabase'

export async function getMembershipsByUserId(userId: string, clientId: string) {
  const { data, error } = await supabase
    .from('memberships')
    .select('*')
    .eq('id_user', userId)
    .eq('client_id', clientId)
    .order('start_date', { ascending: false })

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function getMemberships(clientId: string) {
  const { data, error } = await supabase
    .from('memberships')
    .select('*, profiles(id, first_name, last_name)')
    .eq('client_id', clientId)
    .order('start_date', { ascending: false })

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function getMembershipById(id: string, clientId: string) {
  const { data, error } = await supabase
    .from('memberships')
    .select('*, profiles(id, first_name, last_name)')
    .eq('id_membership', id)
    .eq('client_id', clientId)
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function createMembership(record: {
  id_user: string
  type: string
  start_date: string
  end_date: string
  status?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
}, clientId: string) {
  const { data, error } = await supabase
    .from('memberships')
    .insert({ ...record, client_id: clientId })
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function updateMembership(id: string, updates: {
  type?: string
  start_date?: string
  end_date?: string
  status?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
}, clientId: string) {
  await getMembershipById(id, clientId)

  const { data, error } = await supabase
    .from('memberships')
    .update(updates)
    .eq('id_membership', id)
    .eq('client_id', clientId)
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function deleteMembership(id: string, clientId: string) {
  await getMembershipById(id, clientId)

  const { error } = await supabase
    .from('memberships')
    .delete()
    .eq('id_membership', id)
    .eq('client_id', clientId)

  if (error) {
    console.error(error)
    throw error
  }
  return true
}
