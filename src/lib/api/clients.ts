import { supabase } from '../supabase'

export async function getClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('id_client, name')
    .order('name', { ascending: true })

  if (error) {
    console.error(error)
    throw error
  }
  return data ?? []
}
