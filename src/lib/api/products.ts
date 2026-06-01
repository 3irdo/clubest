// src/lib/api/products.ts
// CRUD for the products table. All queries scoped by client_id.

import { supabase } from '../supabase'

export async function getProducts(clientId?: string | null) {
  let query = supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true })

  if (clientId) {
    query = query.eq('client_id', clientId)
  }

  const { data, error } = await query

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function getProductById(id: string, clientId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id_product', id)
    .eq('client_id', clientId)
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function uploadProductImage(
  file: File,
  productId: string,
  clientId: string
): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const filePath = `${clientId}/${productId}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('products')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    console.error(uploadError)
    throw uploadError
  }

  const { data: urlData } = supabase.storage
    .from('products')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

export async function deleteProductImage(imageUrl: string) {
  const path = imageUrl.replace(
    `${import.meta.env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/`,
    ''
  )
  if (!path) return

  const { error } = await supabase.storage.from('products').remove([path])
  if (error) {
    console.error(error)
    throw error
  }
}

export async function createProduct(record: {
  name: string
  price: number
  stock: number
  description?: string
  image_url?: string
  is_active?: boolean
}, clientId: string) {
  const { data, error } = await supabase
    .from('products')
    .insert({ ...record, client_id: clientId })
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function updateProduct(id: string, updates: {
  name?: string
  price?: number
  stock?: number
  description?: string
  image_url?: string
  is_active?: boolean
}, clientId: string) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id_product', id)
    .eq('client_id', clientId)
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function deleteProduct(id: string, clientId: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id_product', id)
    .eq('client_id', clientId)

  if (error) {
    console.error(error)
    throw error
  }
  return true
}
