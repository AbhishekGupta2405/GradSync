import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { userAPI } from '@/lib/api'
import { User, useAuth } from './AuthContext'
import toast from 'react-hot-toast'

interface ProfileContextType {
  profile: User | null
  isLoadingProfile: boolean
  isSaving: boolean
  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<User | null>(user)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const fetchProfile = async () => {
    if (!isAuthenticated) return
    setIsLoadingProfile(true)
    try {
      const data = await userAPI.getMyProfile()
      setProfile(data as User)
    } catch (error) {
      console.error('Failed to fetch profile', error)
      toast.error('Failed to load profile details')
    } finally {
      setIsLoadingProfile(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile()
    } else {
      setProfile(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const updateProfile = async (data: Partial<User>) => {
    if (!profile) return
    
    setIsSaving(true)
    try {
      await userAPI.updateMyProfile({ ...profile, ...data })
      const updatedUser = { ...profile, ...data } as User
      setProfile(updatedUser)
      
      // Keep localStorage auth user cache mildly updated (only scalar fields matter there)
      const cached = localStorage.getItem('gradsync_user')
      if (cached) {
        localStorage.setItem('gradsync_user', JSON.stringify({ ...JSON.parse(cached), ...data }))
      }
      
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Profile update failed.')
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ProfileContext.Provider value={{ profile, isLoadingProfile, isSaving, fetchProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
