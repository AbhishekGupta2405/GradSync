
import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"
        />
        <div className="flex items-center justify-center space-x-3">
          {/* PIEMR Logo with subtle border */}
          <div className="flex items-center justify-center p-1.5 bg-white rounded-lg shadow-md border border-gray-200">
            <img 
              src="/piemr-logo.png" 
              alt="PIEMR Logo" 
              className="h-10 w-10 object-contain"
            />
          </div>
          
          {/* Clean Brand Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-primary-600 tracking-tight">GradSync</span>
            <div className="text-xs text-gray-500 font-medium tracking-wide -mt-0.5">
              Alumni Network
            </div>
          </div>
        </div>
        <p className="text-gray-600 mt-2">Loading your dashboard...</p>
      </div>
    </div>
  )
}
