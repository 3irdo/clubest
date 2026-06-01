import { supabase } from '../supabase'

export async function getDocuments(clientId: string, userId?: string) {
  let query = supabase
    .from('documents')
    .select('*')
    .eq('client_id', clientId)
    .order('sort_order', { ascending: true })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function getDocumentById(id: string, clientId: string, userId?: string) {
  let query = supabase
    .from('documents')
    .select('*')
    .eq('id_document', id)
    .eq('client_id', clientId)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function uploadDocumentFile(
  file: File,
  clientId: string
): Promise<{ file_name: string; file_type: string; size_bytes: number; file_url: string }> {
  const fileExt = file.name.split('.').pop()
  const filePath = `${clientId}/${Date.now()}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file, { upsert: false })

  if (uploadError) {
    console.error(uploadError)
    throw uploadError
  }

  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath)

  return {
    file_name: file.name,
    file_type: file.type,
    size_bytes: file.size,
    file_url: urlData.publicUrl,
  }
}

export async function createDocument(record: {
  title: string
  file_name: string
  file_type: string
  size_bytes: number
  file_url: string
  sort_order?: number
}, clientId: string, userId: string) {
  const { data, error } = await supabase
    .from('documents')
    .insert({ ...record, client_id: clientId, user_id: userId })
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function updateDocument(id: string, updates: {
  title?: string
  sort_order?: number
}, clientId: string, userId?: string) {
  let query = supabase
    .from('documents')
    .update(updates)
    .eq('id_document', id)
    .eq('client_id', clientId)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.select().maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function deleteDocument(id: string, clientId: string, userId?: string) {
  let query = supabase
    .from('documents')
    .select('file_url')
    .eq('id_document', id)
    .eq('client_id', clientId)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data: doc, error: fetchError } = await query.maybeSingle()

  if (fetchError) {
    console.error(fetchError)
    throw fetchError
  }

  if (doc?.file_url) {
    const path = doc.file_url.replace(
      `${import.meta.env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/`,
      ''
    )
    if (path) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([path])
      if (storageError) {
        console.error(storageError)
      }
    }
  }

  let deleteQuery = supabase
    .from('documents')
    .delete()
    .eq('id_document', id)
    .eq('client_id', clientId)

  if (userId) {
    deleteQuery = deleteQuery.eq('user_id', userId)
  }

  const { error } = await deleteQuery

  if (error) {
    console.error(error)
    throw error
  }
  return true
}

export async function reorderDocuments(
  orderedIds: string[],
  clientId: string,
  userId?: string
) {
  const updates = orderedIds.map((id, index) => ({
    id_document: id,
    client_id: clientId,
    sort_order: index,
    ...(userId ? { user_id: userId } : {}),
  }))

  const { error } = await supabase
    .from('documents')
    .upsert(updates, { onConflict: 'id_document' })

  if (error) {
    console.error(error)
    throw error
  }
  return true
}
