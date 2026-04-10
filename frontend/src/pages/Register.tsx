import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Building, ArrowLeft, GraduationCap, Briefcase } from 'lucide-react'
import { Link, useNavigate as useRouter } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'
import { authAPI } from '@/lib/api'
import PasswordValidator from '@/components/PasswordValidator'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Step Management: 0 = Identity, 1 = Basic, 2 = Academic/Professional, 3 = Terms
  const [step, setStep] = useState(0)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const { register } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    role: '',           // 'STUDENT' or 'ALUMNI'
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    batchYear: '',
    branch: '',
    rollNumber: '',
    currentCompany: '', // Alumni only
    position: '',       // Alumni only
    location: '',       // Alumni only
    agreeToTerms: false,
    allowNetworking: true
  })

  const branches = [
    'Computer Science Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology'
  ]

  const currentYear = new Date().getFullYear()
  const batchYears = Array.from({ length: 20 }, (_, i) => currentYear - i)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (step === 1 && !isPasswordValid) {
      setError('Please ensure your password meets all requirements and passwords match.')
      return
    }
    
    if (step < 3) {
      setStep(step + 1)
    } else {
      setIsLoading(true)
      try {
        await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          batchYear: formData.batchYear,
          branch: formData.branch,
          rollNumber: formData.rollNumber,
          currentCompany: formData.currentCompany,
          position: formData.position,
          location: formData.location,
          role: formData.role
        })
        const routingRole = formData.role.toLowerCase();
        router(`/${routingRole}/dashboard`)
      } catch (error: any) {
        const message = error?.message || 'Registration failed. Please try again.'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleRoleSelect = (role: 'STUDENT' | 'ALUMNI') => {
    setFormData(prev => ({ ...prev, role }))
    setStep(1)
  }

  const handleLinkedInSignup = async () => {
    setError('')
    try {
      const response = await authAPI.getLinkedInAuthUrl(formData.role)
      if (response.authUrl) {
        window.location.href = response.authUrl
      }
    } catch (error: any) {
      setError(error?.message || 'Failed to connect with LinkedIn. Please try again.')
    }
  }

  const renderStep0 = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
       <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to GradSync</h3>
          <p className="text-gray-600">Select your identity to continue</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
             type="button"
             onClick={() => handleRoleSelect('STUDENT')}
             className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer group"
          >
             <GraduationCap className="w-16 h-16 text-gray-400 group-hover:text-primary-500 mb-4 transition-colors" />
             <span className="text-lg font-bold text-gray-900">Current Student</span>
             <span className="text-xs text-gray-500 text-center mt-2">Connect with alumni and search for jobs</span>
          </button>

          <button 
             type="button"
             onClick={() => handleRoleSelect('ALUMNI')}
             className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-xl hover:border-golden-500 hover:bg-golden-50 transition-all cursor-pointer group"
          >
             <Briefcase className="w-16 h-16 text-gray-400 group-hover:text-golden-500 mb-4 transition-colors" />
             <span className="text-lg font-bold text-gray-900">PIEMR Alumni</span>
             <span className="text-xs text-gray-500 text-center mt-2">Post opportunities and mentor students</span>
          </button>
       </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      
      {/* Social Registration */}
      <div>
        <button
          type="button"
          onClick={handleLinkedInSignup}
          className="w-full inline-flex justify-center py-3 px-4 border-2 border-[#0A66C2] rounded-lg shadow-sm bg-white text-sm font-bold text-[#0A66C2] hover:bg-blue-50 transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span className="ml-2">Sign up quickly with LinkedIn</span>
        </button>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or manually enter details</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="John" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Doe" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
          <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="john.doe@example.com" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
          <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Create a strong password" />
          <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
          <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handleChange} className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Confirm your password" />
          <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
          </button>
        </div>
        <PasswordValidator password={formData.password} confirmPassword={formData.confirmPassword} onValidationChange={setIsPasswordValid} />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="batchYear" className="block text-sm font-medium text-gray-700 mb-2">{formData.role === 'ALUMNI' ? 'Graduating Batch' : 'Expected Batch'}</label>
          <select id="batchYear" name="batchYear" required value={formData.batchYear} onChange={handleChange} className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">Select Year</option>
            {(formData.role === 'STUDENT' ? [2026, 2027, 2028] : batchYears).map((year, idx) => <option key={idx} value={year}>{year}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
          <select id="branch" name="branch" required value={formData.branch} onChange={handleChange} className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">Select Branch</option>
            {branches.map((branch, idx) => <option key={idx} value={branch}>{branch}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
        <div className="relative">
          <input id="rollNumber" name="rollNumber" type="text" required value={formData.rollNumber} onChange={handleChange} className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g., 20CS001" />
        </div>
      </div>

      {formData.role === 'ALUMNI' && (
      <>
        <div>
          <label htmlFor="currentCompany" className="block text-sm font-medium text-gray-700 mb-2">Current Company / Startup</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building className="h-5 w-5 text-gray-400" /></div>
            <input id="currentCompany" name="currentCompany" type="text" value={formData.currentCompany} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" placeholder="e.g., Google" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <input id="position" name="position" type="text" value={formData.position} onChange={handleChange} className="block w-full px-3 py-3 border border-gray-300 rounded-lg" placeholder="e.g., Software Engineer" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Current Location</label>
            <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} className="block w-full px-3 py-3 border border-gray-300 rounded-lg" placeholder="e.g., Bangalore" />
          </div>
        </div>
      </>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Identity</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Profile Type:</span> <span className="font-bold text-primary-600">{formData.role}</span></p>
          <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
          <p><span className="font-medium">Email:</span> {formData.email}</p>
          <p><span className="font-medium">Batch:</span> {formData.batchYear} - {formData.branch}</p>
          <p><span className="font-medium">Roll Number:</span> {formData.rollNumber}</p>
          {formData.role === 'ALUMNI' && formData.currentCompany && (
            <p><span className="font-medium">Occupational:</span> {formData.position} @ {formData.currentCompany}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <input id="agreeToTerms" name="agreeToTerms" type="checkbox" required checked={formData.agreeToTerms} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1" />
          <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
            I agree to the <Link to="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</Link> and <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>
          </label>
        </div>

        <div className="flex items-start">
          <input id="allowNetworking" name="allowNetworking" type="checkbox" checked={formData.allowNetworking} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1" />
          <label htmlFor="allowNetworking" className="ml-3 text-sm text-gray-700">
            Allow {formData.role === 'STUDENT' ? 'alumni' : 'other network members'} to find and connect with me
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md w-full space-y-8">
        <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </Link>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-golden-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold">GS</span></div>
            <span className="text-3xl font-bold text-primary-500">GradSync</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Join the Network</h2>
          <p className="mt-2 text-gray-600">Unlock your university ecosystem</p>
        </div>

        {step > 0 && (
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNumber ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && <div className={`w-12 h-1 mx-2 ${step > stepNumber ? 'bg-primary-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        )}

        <motion.form key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="card p-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {step > 0 && (
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {step === 1 && 'Basic Information'}
              {step === 2 && (formData.role === 'STUDENT' ? 'Academic Details' : 'Professional Details')}
              {step === 3 && 'Complete Registration'}
            </h3>
          </div>
          )}

          {step === 0 && renderStep0()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {step > 0 && (
          <div className="flex space-x-4">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step === 1 ? 0 : step - 1)} className="flex-1 btn-secondary py-3">Previous</button>
            )}
            <button type="submit" disabled={(step === 1 && !isPasswordValid) || isLoading} className={`flex-1 py-3 transition-colors flex items-center justify-center ${(step === 1 && !isPasswordValid) || isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'btn-primary'}`}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : step === 3 ? 'Create Account' : 'Next'}
            </button>
          </div>
          )}
        </motion.form>
        <div className="text-center">
          <p className="text-gray-600">Already have an account? <Link to="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link></p>
        </div>
      </motion.div>
    </div>
  )
}
