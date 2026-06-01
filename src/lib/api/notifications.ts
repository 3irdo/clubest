import { supabase } from '../supabase'

export interface Notification {
  id_notification: string
  client_id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean | null
  link: string | null
  created_at: string | null
}

export async function notifyRole(
  clientId: string,
  roleName: string,
  data: { title: string; message: string; type?: string; link?: string }
): Promise<void> {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, roles!inner(name)')
    .eq('client_id', clientId)
    .eq('roles.name', roleName)
    .eq('is_active', true)

  if (error) {
    console.error(error)
    return
  }

  const notifications = (profiles ?? []).map((p: any) => ({
    client_id: clientId,
    user_id: p.id,
    title: data.title,
    message: data.message,
    type: data.type ?? 'info',
    link: data.link ?? null,
  }))

  if (notifications.length === 0) return

  const { error: insertError } = await supabase
    .from('notifications')
    .insert(notifications)

  if (insertError) {
    console.error(insertError)
  }
}

export async function getNotifications(
  userId: string,
  clientId: string,
  onlyUnread = false
): Promise<Notification[]> {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (onlyUnread) {
    query = query.eq('is_read', false)
  }

  const { data, error } = await query

  if (error) {
    console.error(error)
    throw error
  }
  return data ?? []
}

export async function getUnreadCount(userId: string, clientId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('client_id', clientId)
    .eq('is_read', false)

  if (error) {
    console.error(error)
    throw error
  }
  return count ?? 0
}

export async function createNotification(
  record: {
    client_id: string
    user_id: string
    title: string
    message: string
    type?: string
    link?: string
  }
): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      client_id: record.client_id,
      user_id: record.user_id,
      title: record.title,
      message: record.message,
      type: record.type ?? 'info',
      link: record.link ?? null,
    })
    .select()
    .maybeSingle()

  if (error) {
    console.error(error)
    throw error
  }
  return data!
}

export async function markAsRead(
  id: string,
  userId: string,
  clientId: string
): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id_notification', id)
    .eq('user_id', userId)
    .eq('client_id', clientId)

  if (error) {
    console.error(error)
    throw error
  }
}

export async function markAllAsRead(
  userId: string,
  clientId: string
): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('client_id', clientId)
    .eq('is_read', false)

  if (error) {
    console.error(error)
    throw error
  }
}

export async function deleteNotification(
  id: string,
  userId: string,
  clientId: string
): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id_notification', id)
    .eq('user_id', userId)
    .eq('client_id', clientId)

  if (error) {
    console.error(error)
    throw error
  }
}
