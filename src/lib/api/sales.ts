// src/lib/api/sales.ts
// CRUD for the sales table. All queries scoped by client_id.

import { supabase } from '../supabase'

export async function getSales(clientId: string) {
  const { data, error } = await supabase
    .from('sales')
    .select('*, profiles!fk_sale_user(first_name, last_name), sale_details(*, products(name, price))')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function getSaleById(id: string, clientId: string) {
  const { data, error } = await supabase
    .from('sales')
    .select('*, profiles!fk_sale_user(first_name, last_name), sale_details(*, products(name, price))')
    .eq('id_sale', id)
    .eq('client_id', clientId)
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function createSale(record: {
  id_user: string
  total?: number
}, clientId: string) {
  const { data, error } = await supabase
    .from('sales')
    .insert({ ...record, client_id: clientId })
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function updateSale(id: string, updates: {
  total?: number
}, clientId: string) {
  const { data, error } = await supabase
    .from('sales')
    .update(updates)
    .eq('id_sale', id)
    .eq('client_id', clientId)
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function deleteSale(id: string, clientId: string) {
  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id_sale', id)
    .eq('client_id', clientId)

  if (error) {
    console.error(error)
    throw error
  }
  return true
}

export async function createSaleDetails(
  details: { id_sale: string; id_product: string; quantity: number; unit_price: number }[],
) {
  const { data, error } = await supabase
    .from('sale_details')
    .insert(details)
    .select()

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export async function decrementProductStock(id: string, quantity: number, clientId: string) {
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock')
    .eq('id_product', id)
    .eq('client_id', clientId)
    .maybeSingle()

  if (fetchError) {
    console.error(fetchError)
    throw fetchError
  }
  if (!product) throw new Error('Producto no encontrado')
  if (product.stock < quantity) throw new Error('Stock insuficiente')

  const { error: updateError } = await supabase
    .from('products')
    .update({ stock: product.stock - quantity })
    .eq('id_product', id)
    .eq('client_id', clientId)

  if (updateError) {
    console.error(updateError)
    throw updateError
  }
}

export async function createCompleteSale(
  userId: string,
  items: { id_product: string; quantity: number; unit_price: number }[],
  clientId: string,
) {
  const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)

  const sale = await createSale({ id_user: userId, total }, clientId)
  if (!sale) throw new Error('Error al crear la venta')

  const details = items.map(i => ({
    id_sale: sale.id_sale,
    id_product: i.id_product,
    quantity: i.quantity,
    unit_price: i.unit_price,
  }))
  await createSaleDetails(details)

  for (const item of items) {
    await decrementProductStock(item.id_product, item.quantity, clientId)
  }

  return sale
}
