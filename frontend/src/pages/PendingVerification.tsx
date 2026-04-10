import React from 'react'
import { LogOut, Clock, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function PendingVerification() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8 border border-neutral-100">
        <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-12 h-12 text-blue-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-display">
          Under Review
        </h1>
        
        <p className="text-neutral-500 mb-8 leading-relaxed">
          Hello <span className="font-semibold text-neutral-700">{user?.firstName}</span>, your account has been successfully created. For security and privacy, platform administrators must verify your identity before granting full access.
        </p>

        <div className="bg-neutral-50 rounded-xl p-5 text-left mb-8 space-y-4">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0"/>
            <div>
              <h3 className="font-semibold text-sm text-neutral-900">Identity Verification</h3>
              <p className="text-xs text-neutral-500">We verify your Roll Number against university records.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0"/>
            <div>
              <h3 className="font-semibold text-sm text-neutral-900">Wait Time</h3>
              <p className="text-xs text-neutral-500">Approvals typically take 1-2 business days.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 rounded-lg transition-colors border border-transparent focus:ring-4 focus:ring-neutral-200"
        >
          <LogOut className="w-5 h-5" />
          Sign Out Let me check back later
        </button>
      </div>
      
      <div className="mt-8 text-sm text-neutral-400">
        GradSync © {new Date().getFullYear()}
      </div>
    </div>
  )
}
