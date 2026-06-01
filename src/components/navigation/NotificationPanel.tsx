import React, { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck, Trash2, Info, AlertCircle, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../hooks/useData'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type Notification,
} from '../../lib/api/notifications'
import { withBase } from '../../lib/withBase'

const typeIcons: Record<string, React.ComponentType<any>> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
}

const typeColors: Record<string, string> = {
  info: 'text-blue-500 bg-blue-50',
  success: 'text-green-500 bg-green-50',
  warning: 'text-amber-500 bg-amber-50',
  error: 'text-red-500 bg-red-50',
}

const typeDotColors: Record<string, string> = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
}

export const NotificationPanel: React.FC = () => {
  const { profile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const { data: notifications, reload: reloadNotifications } = useData<Notification[]>(
    () => profile ? getNotifications(profile.id, profile.client_id) : Promise.resolve([]),
    [profile?.id, profile?.client_id]
  )

  const { data: unreadCount, reload: reloadCount } = useData<number>(
    () => profile ? getUnreadCount(profile.id, profile.client_id) : Promise.resolve(0),
    [profile?.id, profile?.client_id]
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAsRead = async (id: string) => {
    if (!profile) return
    try {
      await markAsRead(id, profile.id, profile.client_id)
      reloadNotifications()
      reloadCount()
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!profile) return
    try {
      await markAllAsRead(profile.id, profile.client_id)
      reloadNotifications()
      reloadCount()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!profile) return
    try {
      await deleteNotification(id, profile.id, profile.client_id)
      reloadNotifications()
      reloadCount()
    } catch (err) {
      console.error(err)
    }
  }

  const unread = unreadCount ?? 0
  const list = notifications ?? []

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-primary rounded-lg transition-colors relative"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-accent-green text-primary-dark text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-96 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
            <h3 className="text-sm font-semibold text-primary-dark">Notifications</h3>
            {unread > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-xs text-accent-green hover:text-green-600 transition-colors"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {list.length === 0 ? (
              <div className="px-4 py-8 text-center text-text-secondary text-sm">
                <Bell size={24} className="mx-auto mb-2 opacity-40" />
                No notifications
              </div>
            ) : (
              list.map((n) => {
                const Icon = typeIcons[n.type] ?? Info
                const colorClass = typeColors[n.type] ?? typeColors.info
                return (
                  <div
                    key={n.id_notification}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors group ${
                      !n.is_read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`p-1.5 rounded-full ${colorClass} shrink-0 mt-0.5`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-primary-dark truncate">
                            {n.title}
                          </p>
                          {!n.is_read && (
                            <span className={`w-2 h-2 rounded-full ${typeDotColors[n.type] ?? typeDotColors.info} shrink-0 mt-1.5`} />
                          )}
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-gray-400">
                            {n.created_at
                              ? new Date(n.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </span>
                          {n.link && (
                            <a
                              href={withBase(n.link)}
                              className="text-[10px] text-accent-green hover:underline flex items-center gap-0.5"
                              onClick={() => setIsOpen(false)}
                            >
                              View <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        {!n.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(n.id_notification)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Mark as read"
                          >
                            <CheckCheck size={14} className="text-text-secondary" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(n.id_notification)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
