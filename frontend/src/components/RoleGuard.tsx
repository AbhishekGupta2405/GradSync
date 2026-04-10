import { useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { role: urlRole } = useParams<{ role: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      // If they try to access a protected role route without logging in, bounce them
      navigate('/auth/login', { state: { from: location }, replace: true })
      return;
    }

    // Role Enforcement Matrix
    const actualRole = user.role.toLowerCase()

    // 1. Verification Gate
    const isPendingPage = location.pathname === '/pending-verification'
    if (!user.isVerified && actualRole !== 'admin' && !isPendingPage) {
      navigate('/pending-verification', { replace: true })
      return;
    }

    if (user.isVerified && isPendingPage) {
       navigate(`/${actualRole}/dashboard`, { replace: true })
       return;
    }
    
    // 2. Identity Scope Check
    if (urlRole && urlRole.toLowerCase() !== actualRole) {
      // Identity misalignment discovered! Force sync.
      // E.g. They are a student attempting to access /alumni/jobs -> force bounce to /student/jobs
      const safePath = location.pathname.replace(`/${urlRole}`, `/${actualRole}`)
      console.warn(`[RoleGuard Alert] Security interception: User role '${actualRole}' restricted from entering '${urlRole}' vector. Re-routing.`)
      navigate(safePath, { replace: true })
    }
    
  }, [user, isAuthenticated, isLoading, urlRole, navigate, location])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
  }

  // If we reach here, either they are in a permitted route, or React Router will bounce them during navigation
  return <>{children}</>
}
