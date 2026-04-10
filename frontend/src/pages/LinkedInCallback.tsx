import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function LinkedInCallback() {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { loginWithLinkedIn } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search)
      const code = searchParams.get('code')
      const role = searchParams.get('state') // we passed role in state
      const err = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (err) {
        setError(errorDescription || 'LinkedIn authorization failed')
        setTimeout(() => navigate('/auth/login'), 3000)
        return
      }

      if (code) {
        try {
          await loginWithLinkedIn(code, role || undefined)
          // Look at saved user to redirect
          let targetRole = 'student'
          const rawMem = localStorage.getItem('gradsync_user')
          if (rawMem) {
            try { targetRole = JSON.parse(rawMem).role.toLowerCase() || 'student' } catch { /* ignore */ } 
          }
          navigate(`/${targetRole}/dashboard`)
        } catch (error: any) {
          setError(error.message || 'Failed to complete LinkedIn login')
          setTimeout(() => navigate('/auth/login'), 3000)
        }
      } else {
        setError('No authorization code received')
        setTimeout(() => navigate('/auth/login'), 3000)
      }
    }

    handleCallback()
  }, [location, loginWithLinkedIn, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-xl text-center">
        {error ? (
          <div>
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connecting to LinkedIn...</h2>
            <p className="text-gray-600">Please wait while we complete your sign in.</p>
          </div>
        )}
      </div>
    </div>
  )
}
