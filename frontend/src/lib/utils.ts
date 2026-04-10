import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatBatchYear(year: number): string {
  return `Batch of ${year}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function formatPhoneNumber(phone: string): string {
  // Format Indian phone numbers
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return phone
}

export function getCompanyLogo(companyName: string): string {
  // Return placeholder logo URL based on company name
  const logos: { [key: string]: string } = {
    'Google': 'https://logo.clearbit.com/google.com',
    'Microsoft': 'https://logo.clearbit.com/microsoft.com',
    'Amazon': 'https://logo.clearbit.com/amazon.com',
    'Apple': 'https://logo.clearbit.com/apple.com',
    'Meta': 'https://logo.clearbit.com/meta.com',
    'Netflix': 'https://logo.clearbit.com/netflix.com',
    'Tesla': 'https://logo.clearbit.com/tesla.com',
  }
  
  return logos[companyName] || `https://via.placeholder.com/40x40/2563eb/ffffff?text=${companyName.charAt(0)}`
}
