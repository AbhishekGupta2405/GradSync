import { useMemo, useEffect } from 'react'
import { Check, X } from 'lucide-react'

interface PasswordValidatorProps {
  password: string
  confirmPassword: string
  onValidationChange: (isValid: boolean) => void
}

interface ValidationRule {
  id: string
  label: string
  test: (password: string) => boolean
}

const passwordRules: ValidationRule[] = [
  {
    id: 'length',
    label: 'At least 8 characters long',
    test: (password: string) => password.length >= 8
  },
  {
    id: 'uppercase',
    label: 'Contains at least one uppercase letter (A-Z)',
    test: (password: string) => /[A-Z]/.test(password)
  },
  {
    id: 'lowercase',
    label: 'Contains at least one lowercase letter (a-z)',
    test: (password: string) => /[a-z]/.test(password)
  },
  {
    id: 'number',
    label: 'Contains at least one number (0-9)',
    test: (password: string) => /\d/.test(password)
  },
  {
    id: 'special',
    label: 'Contains at least one special character (!@#$%^&*)',
    test: (password: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  }
]

export default function PasswordValidator({ password, confirmPassword, onValidationChange }: PasswordValidatorProps) {
  const validationResults = useMemo(() => {
    const results: Record<string, boolean> = {}
    passwordRules.forEach(rule => {
      results[rule.id] = rule.test(password)
    })
    return results
  }, [password])

  const passwordsMatch = useMemo(() => {
    return Boolean(password && confirmPassword && password === confirmPassword)
  }, [password, confirmPassword])

  useEffect(() => {
    const allRulesPassed = Object.values(validationResults).every(Boolean)
    const isValid = allRulesPassed && (confirmPassword === '' || passwordsMatch)
    onValidationChange(Boolean(isValid))
  }, [validationResults, confirmPassword, passwordsMatch, onValidationChange])

  if (!password) return null

  return (
    <div className="mt-3 space-y-3">
      {/* Password Requirements */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Password Requirements:</h4>
        <div className="space-y-2">
          {passwordRules.map(rule => {
            const isValid = validationResults[rule.id]
            return (
              <div key={rule.id} className="flex items-center space-x-2">
                <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                  isValid ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isValid ? (
                    <Check size={12} className="text-green-600" />
                  ) : (
                    <X size={12} className="text-red-600" />
                  )}
                </div>
                <span className={`text-sm ${
                  isValid ? 'text-green-700' : 'text-red-700'
                }`}>
                  {rule.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Password Match Validation */}
      {confirmPassword && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
              passwordsMatch ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passwordsMatch ? (
                <Check size={12} className="text-green-600" />
              ) : (
                <X size={12} className="text-red-600" />
              )}
            </div>
            <span className={`text-sm ${
              passwordsMatch ? 'text-green-700' : 'text-red-700'
            }`}>
              Passwords match
            </span>
          </div>
        </div>
      )}

      {/* Password Strength Indicator */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Password Strength:</span>
          <span className={`text-sm font-medium ${
            getPasswordStrength(validationResults) === 'Strong' ? 'text-green-600' :
            getPasswordStrength(validationResults) === 'Medium' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {getPasswordStrength(validationResults)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              getPasswordStrength(validationResults) === 'Strong' ? 'bg-green-500 w-full' :
              getPasswordStrength(validationResults) === 'Medium' ? 'bg-yellow-500 w-2/3' :
              'bg-red-500 w-1/3'
            }`}
          />
        </div>
      </div>
    </div>
  )
}

function getPasswordStrength(validationResults: Record<string, boolean>): 'Weak' | 'Medium' | 'Strong' {
  const passedRules = Object.values(validationResults).filter(Boolean).length
  
  if (passedRules >= 4) return 'Strong'
  if (passedRules >= 2) return 'Medium'
  return 'Weak'
}
