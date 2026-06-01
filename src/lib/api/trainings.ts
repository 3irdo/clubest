// src/lib/api/trainings.ts
// CRUD for the trainings table. All queries scoped by client_id.

import { supabase } from '../supabase'

export async function getTrainings(clientId: string) {
  const { data, error } = await supabase
    .from('trainings')
    .select('*, profiles!fk_training_coach(first_name, last_name)')   // join coach name
    .eq('client_id', clientId)
    .order('date', { ascending: true })

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function getTrainingById(id: string, clientId: string) {
  const { data, error } = await supabase
    .from('trainings')
    .select('*, profiles!fk_training_coach(first_name, last_name)')
    .eq('id_training', id)
    .eq('client_id', clientId)
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function createTraining(record: {
  date: string
  time: string
  capacity: number
  coach_id?: string
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELED'
}, clientId: string) {
  const { data, error } = await supabase
    .from('trainings')
    .insert({ ...record, client_id: clientId })
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function updateTraining(id: string, updates: {
  date?: string
  time?: string
  capacity?: number
  coach_id?: string
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELED'
}, clientId: string) {
  const { data, error } = await supabase
    .from('trainings')
    .update(updates)
    .eq('id_training', id)
    .eq('client_id', clientId)
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function deleteTraining(id: string, clientId: string) {
  const { error } = await supabase
    .from('trainings')
    .delete()
    .eq('id_training', id)
    .eq('client_id', clientId)

  if (error) {
    console.error(error)
    throw error
  }
  return true
}
