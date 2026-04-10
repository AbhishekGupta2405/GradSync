'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI, userAPI } from '@/lib/api'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  batchYear?: string
  branch?: string
  rollNumber: string
  currentCompany?: string
  position?: string
  location?: string
  profileImage?: string
  headline?: string
  role: 'alumni' | 'student' | 'admin'
  isVerified: boolean
  joinedAt: Date
  skills?: string[]
  achievements?: string[]
  socialLinks?: Record<string, string>
  projects?: { id?: number, title: string; projectUrl: string; description: string; startDate?: string; endDate?: string }[]
  certifications?: { id?: number, name: string; issuer: string; issueDate: string; credentialUrl: string }[]
  experiences?: { id?: number, companyName: string; designation: string; location: string; startDate?: string; endDate?: string; current: boolean; description: string }[]
  bio?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loginWithLinkedIn: (code: string, role?: string) => Promise<void>
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  batchYear: string
  branch: string
  rollNumber: string
  currentCompany?: string
  position?: string
  location?: string
  role: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock authentication - replace with real API calls
  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('gradsync_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('gradsync_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const authData: any = await authAPI.login(email, password)
      
      if (authData.token && authData.userId) {
        // Set token first so getProfile is authorized
        localStorage.setItem('gradsync_token', authData.token)
        
        let profileData: any = {}
        try {
            profileData = await userAPI.getProfile(authData.userId)
        } catch {
            console.warn("Could not fetch profile, using defaults")
        }

        const user: User = {
          id: authData.userId,
          firstName: profileData.firstName || 'User',
          lastName: profileData.lastName || '',
          email: authData.email,
          batchYear: profileData.batchYear?.toString() || '',
          branch: profileData.branch || '',
          location: profileData.location || '',
          profileImage: profileData.profileImageUrl,
          role: authData.role.toLowerCase(),
          isVerified: profileData.isVerified ?? profileData.verified ?? false,
          joinedAt: new Date(),
          rollNumber: profileData.rollNumber || '' // Ensure rollNumber is always present
        }
        
        setUser(user)
        localStorage.setItem('gradsync_user', JSON.stringify(user))
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      throw new Error(error instanceof Error && error.message.includes('ACCOUNT_DISABLED') ? 
        'Account verification pending. Our administrators are currently reviewing your profile.' : 
        'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      // 1. Create Auth account
      const authData: any = await authAPI.register({
        email: userData.email,
        password: userData.password,
        role: userData.role // Using strictly provided role
      })
      
      if (authData.token && authData.userId) {
        // 2. Set tokens
        localStorage.setItem('gradsync_token', authData.token)

        // 3. Create Profile
        const profileData: any = await userAPI.createOrUpdateProfile(authData.userId, {
          firstName: userData.firstName,
          lastName: userData.lastName,
          batchYear: userData.batchYear ? parseInt(userData.batchYear) : null,
          branch: userData.branch,
          location: userData.location,
          currentCompany: userData.currentCompany,
          position: userData.position,
          role: authData.role
        })

        const user: User = {
          id: authData.userId,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: authData.email,
          batchYear: profileData.batchYear?.toString() || '2024',
          branch: profileData.branch || 'CSE',
          location: profileData.location || 'India',
          currentCompany: profileData.currentCompany || '',
          position: profileData.position || '',
          profileImage: profileData.profileImageUrl || '',
          role: authData.role.toLowerCase() as 'student' | 'alumni' | 'admin',
          rollNumber: userData.rollNumber || '', // Use provided rollNumber or empty string
          isVerified: false,
          joinedAt: new Date()
        }
        
        setUser(user)
        localStorage.setItem('gradsync_user', JSON.stringify(user))
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('gradsync_user')
    localStorage.removeItem('gradsync_token')
    localStorage.removeItem('gradsync_refresh_token')
  }

  const loginWithLinkedIn = async (code: string, role?: string) => {
    setIsLoading(true)
    try {
      const authData: any = await authAPI.linkedInCallback(code, role)

      if (authData.token && authData.userId) {
        localStorage.setItem('gradsync_token', authData.token)
        
        let profileData: any = {}
        if (authData.newUser) {
           // Auto-create basic profile
           profileData = await userAPI.createOrUpdateProfile(authData.userId, {
              firstName: authData.email.split('@')[0], // LinkedIn doesn't guarantee first/last name in standard profile without email scope sometimes, so fallback
              lastName: '',
              role: authData.role,
              profileImageUrl: authData.linkedinPictureUrl
           })
        } else {
           try {
               profileData = await userAPI.getProfile(authData.userId)
           } catch {
               console.warn("Could not fetch profile, using defaults")
           }
        }

        const user: User = {
          id: authData.userId,
          firstName: profileData.firstName || 'User',
          lastName: profileData.lastName || '',
          email: authData.email,
          batchYear: profileData.batchYear?.toString() || '',
          branch: profileData.branch || '',
          location: profileData.location || '',
          profileImage: profileData.profileImageUrl || authData.linkedinPictureUrl,
          role: authData.role.toLowerCase(),
          isVerified: profileData.isVerified ?? profileData.verified ?? false,
          joinedAt: new Date(),
          rollNumber: profileData.rollNumber || ''
        }
        
        setUser(user)
        localStorage.setItem('gradsync_user', JSON.stringify(user))
      } else {
        throw new Error('LinkedIn login failed')
      }
    } catch (error) {
      throw new Error(error instanceof Error && error.message.includes('ACCOUNT_DISABLED') ? 
        'Account verification pending. Our administrators are currently reviewing your profile.' : 
        'Login with LinkedIn failed.')
    } finally {
      setIsLoading(false)
    }
  }



  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loginWithLinkedIn
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Mock data for development

