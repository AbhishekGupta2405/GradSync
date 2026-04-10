import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ShieldAlert, ArrowLeft } from 'lucide-react'
import { Link, useNavigate as useRouter } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, logout } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errorStatus, setErrorStatus] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorStatus(null)

    try {
      await login(formData.email, formData.password)
      
      // Perform strict local role verification to block malicious lateral entry
      let internalRole = 'student'
      const rawMem = localStorage.getItem('gradsync_user')
      
      if (rawMem) {
        try { 
            internalRole = JSON.parse(rawMem).role.toLowerCase() 
        } catch { /* ignore parse errors */ } 
      }
      
      if (internalRole !== 'admin') {
         // Forcefully revoke the issued tokens, this sector is highly restricted.
         logout()
         setErrorStatus("Access Denied: The authenticated profile lacks Administrative clearances.")
         return;
      }
      
      router(`/admin/dashboard`, { replace: true })
      
    } catch (error) {
      console.error('Admin Login Error:', error)
      setErrorStatus("Failed to authenticate with the provided credentials.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Dark Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl opacity-50 mix-blend-screen" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl opacity-50 mix-blend-screen" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        
        {/* Navigation Escape Hatch */}
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18} className="mr-2" /> Abort to Public Mesh
        </Link>
        
        {/* Security Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mb-6 drop-shadow-lg">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Overwatch Protocol</h2>
          <p className="mt-2 text-gray-400 text-sm">Restricted administrative access gateway.</p>
        </div>

        {/* Console Box Form */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
          
          {errorStatus && (
             <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-red-950/50 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-start text-sm">
                 <ShieldAlert className="w-5 h-5 mr-3 shrink-0" />
                 <span>{errorStatus}</span>
             </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Clearance Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-600" /></div>
                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 bg-gray-950 border border-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 placeholder-gray-600" placeholder="admin@gradsync.net" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Access Cipher</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-600" /></div>
                <input name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className="block w-full pl-10 pr-10 py-3 bg-gray-950 border border-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 placeholder-gray-600" placeholder="••••••••" />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-600 hover:text-gray-400" /> : <Eye className="h-5 w-5 text-gray-600 hover:text-gray-400" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] tracking-widest text-sm uppercase">
              Initialize Uplink
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
