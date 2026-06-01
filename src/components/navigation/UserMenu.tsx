import React, { useState, useRef, useEffect } from 'react'
import { LogOut, Settings, Users, Package, DollarSign, Calendar, CheckSquare, UserCircle, CreditCard, ShoppingBag } from 'lucide-react'
import { withBase } from '../../lib/withBase'
import { useAuth, ROLE_NAMES } from '../../context/AuthContext'

export const UserMenu: React.FC = () => {
  const { profile, role, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!profile) return null

  const fullName = `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
  const roleName = role ?? ''
  const firstNameLetter = (profile.first_name ?? '?').charAt(0).toUpperCase()

  const adminActions = [
    { icon: Users, label: 'Manage Users', path: '/admin' },
    { icon: Package, label: 'Manage Products', path: '/admin' },
    { icon: DollarSign, label: 'View Sales', path: '/payments' },
  ]

  const coachActions = [
    { icon: Calendar, label: 'My Trainings', path: '/training' },
    { icon: CheckSquare, label: 'Attendance', path: '/training' },
  ]

  const memberActions = [
    { icon: UserCircle, label: 'My Profile', path: '/profile' },
    { icon: CreditCard, label: 'My Membership', path: '/payments' },
    { icon: ShoppingBag, label: 'My Payments', path: '/payments' },
  ]

  let quickActions = memberActions
  if (roleName === ROLE_NAMES.ADMIN) quickActions = adminActions
  else if (roleName === ROLE_NAMES.COACH) quickActions = coachActions

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-primary rounded-lg transition-colors"
      >
        {profile.image_url ? (
          <img
            src={profile.image_url}
            alt={fullName}
            className="w-8 h-8 rounded-full object-cover border-2 border-accent-green"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary border-2 border-accent-green flex items-center justify-center text-white text-sm font-bold">
            {firstNameLetter}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {profile.image_url ? (
                <img
                  src={profile.image_url}
                  alt={fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">
                  {firstNameLetter}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary-dark truncate">
                  {fullName}
                </p>
                <p className="text-xs text-text-secondary capitalize">{roleName?.toLowerCase()}</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Quick Actions
            </p>
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <a
                  key={action.label}
                  href={withBase(action.path)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={16} className="text-text-secondary" />
                  {action.label}
                </a>
              )
            })}
          </div>

          <div className="px-2 py-1">
            <a
              href={withBase('/profile')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} className="text-text-secondary" />
              Profile Settings
            </a>
            <button
              onClick={async () => {
                setIsOpen(false)
                await logout()
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
