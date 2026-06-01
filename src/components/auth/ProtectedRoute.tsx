import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { withBase } from '../../lib/withBase'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const LOADING_DELAY = 300

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
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
    }
  }, [isLoading, isAuthenticated])

  if (isLoading && showLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-400 text-sm">Verificando sesión...</p>
      </div>
    )
  }

  if (isLoading) return null

  if (!isAuthenticated) return null

  return <>{children}</>
}

export default ProtectedRoute
