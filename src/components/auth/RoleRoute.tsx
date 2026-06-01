import React, { useEffect, useState, useRef } from 'react'
import { useAuth, ROLE_NAMES } from '../../context/AuthContext'
import { withBase } from '../../lib/withBase'

interface RoleRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

const LOADING_DELAY = 300

const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, hasRole, role } = useAuth()
  const [showLoading, setShowLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (isLoading && !showLoading) {
      timerRef.current = setTimeout(() => setShowLoading(true), LOADING_DELAY)
    } else if (!isLoading) {
      setShowLoading(false)
    }
    return () => clearTimeout(timerRef.current)
  }, [isLoading, showLoading])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = withBase('login')
      return
    }
    if (!isLoading && isAuthenticated && role && !hasRole(...allowedRoles)) {
      window.location.href = withBase('dashboard')
    }
  }, [isLoading, isAuthenticated, role])

  if (isLoading && showLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-400 text-sm">Verificando sesión...</p>
      </div>
    )
  }

  if (isLoading) return null
  if (!isAuthenticated) return null
  if (role && !hasRole(...allowedRoles)) return null

  return <>{children}</>
}

export default RoleRoute
