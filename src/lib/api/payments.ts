import { supabase } from '../supabase'

export async function getPaymentsByUserId(userId: string, clientId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id_user', userId)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function getPayments(clientId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('client_id', clientId)

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function getPaymentById(id: string, clientId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id_payment', id)
    .eq('client_id', clientId)
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function createPayment(record: any, clientId: string) {
  const { data, error } = await supabase
    .from('payments')
    .insert({ ...record, client_id: clientId })
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function updatePayment(id: string, updates: any, clientId: string) {
  const { data, error } = await supabase
    .from('payments')
    .update(updates)
    .eq('id_payment', id)
    .eq('client_id', clientId)
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function deletePayment(id: string, clientId: string) {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id_payment', id)
    .eq('client_id', clientId)

  if (error) {
    console.error(error)
    throw error
  }
  return true
}
