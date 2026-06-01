import { supabase } from '../supabase'

export async function getUsers(clientId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('client_id', clientId)

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function getUserById(id: string, clientId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('client_id', clientId)
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function createUser(record: any, clientId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ ...record, client_id: clientId })
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function updateUser(id: string, updates: any, clientId: string) {
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

export async function deleteUser(id: string, clientId: string) {
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
