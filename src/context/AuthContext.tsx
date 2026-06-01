import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { withBase } from '../lib/withBase'

export interface Profile {
  id: string
  client_id: string
  id_role: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  image_url?: string
  is_active?: boolean
  roles?: { name: string } | null
}

export const ROLE_NAMES = {
  ADMIN: 'ADMIN',
  COACH: 'COACH',
  MEMBER: 'MEMBER',
} as const

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  isAuthenticated: boolean
  isLoading: boolean
  role: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  hasRole: (...roles: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

let cachedSession: Session | null = null
let cachedUser: User | null = null
let cachedProfile: Profile | null = null

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(cachedUser)
  const [session, setSession] = useState<Session | null>(cachedSession)
  const [profile, setProfile] = useState<Profile | null>(cachedProfile)
  const [isLoading, setIsLoading] = useState(!cachedSession)

  useEffect(() => {
    cachedSession = session
    cachedUser = user
    cachedProfile = profile
  }, [session, user, profile])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, roles(name)')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Database error fetching profile:', error)
        throw error
      }

      if (!data) {
        console.warn(`No profile found for user ${userId}. This can happen if signup triggers fail.`)
      }

      setProfile(data as any)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setProfile(null)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null
      setSession(data.session)
      setUser(currentUser)
      if (currentUser) {
        setIsLoading(false)
        fetchProfile(currentUser.id)
      } else {
        setProfile(null)
        setIsLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return

      const currentUser = session?.user ?? null
      setSession(session)
      setUser(currentUser)
      if (currentUser) {
        fetchProfile(currentUser.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error(error)
      throw error
    }

    setSession(data.session)
    setUser(data.user)
    if (data.user) {
      fetchProfile(data.user.id)
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error(error)
      throw error
    }

    setSession(null)
    setUser(null)
    setProfile(null)
    window.location.href = withBase('login')
  }

  const refreshProfile = async () => {
    const currentUser = user ?? cachedUser
    if (!currentUser) return
    await fetchProfile(currentUser.id)
  }

  const role = profile?.roles?.name ?? null

  const hasRole = (...roles: string[]) => {
    if (!role) return false
    return roles.includes(role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated: !!user,
        isLoading,
        role,
        login,
        logout,
        refreshProfile,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
