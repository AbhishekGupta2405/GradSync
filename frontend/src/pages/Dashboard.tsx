
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate as useRouter } from 'react-router-dom';
import { useEffect } from 'react'
import AlumniDashboard from '@/components/dashboard/AlumniDashboard'
import StudentDashboard from '@/components/dashboard/StudentDashboard'
import AdminDashboard from '@/components/dashboard/AdminDashboard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // Render different dashboards based on user role
  switch (user.role) {
    case 'alumni':
      return <AlumniDashboard />
    case 'student':
      return <StudentDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      return <AlumniDashboard />
  }
}
