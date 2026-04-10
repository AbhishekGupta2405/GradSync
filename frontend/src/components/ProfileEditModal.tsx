import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, User, Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'
import { profileImageAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { user } = useAuth()
  const { profile, updateProfile } = useProfile()
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileImage, setProfileImage] = useState(profile?.profileImage || user?.profileImage || '')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    branch: '',
    batchYear: '',
    currentCompany: '',
    position: '',
    location: '',
    bio: '',
    skills: [] as string[],
    achievements: [] as string[],
    socialLinks: { linkedin: '', github: '', portfolio: '' },
    projects: [] as any[],
    certifications: [] as any[],
    experiences: [] as any[]
  })

  // Synchronize when opened or profile changes
  useEffect(() => {
    if (isOpen && (profile || user)) {
      const source = profile || user;
      setFormData({
        firstName: source?.firstName || '',
        lastName: source?.lastName || '',
        branch: source?.branch || '',
        batchYear: source?.batchYear || '',
        currentCompany: source?.currentCompany || '',
        position: source?.position || '',
        location: source?.location || '',
        bio: source?.bio || '',
        skills: source?.skills || [],
        achievements: source?.achievements || [],
        socialLinks: {
          linkedin: source?.socialLinks?.linkedin || '',
          github: source?.socialLinks?.github || '',
          portfolio: source?.socialLinks?.portfolio || ''
        },
        projects: source?.projects || [],
        certifications: source?.certifications || [],
        experiences: source?.experiences || []
      });
      setProfileImage(source?.profileImage || source?.profileImageUrl || '');
    }
  }, [isOpen, profile, user]);

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      // Use fallback properties for userId standard alignment
      const targetUserId = user?.id || (user as any)?.userId;
      const result = await profileImageAPI.uploadImage(targetUserId, file)
      setProfileImage(result.profileImageUrl)
      await updateProfile({ profileImageUrl: result.profileImageUrl } as any)
      toast.success('Image uploaded successfully')
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProfile({
        ...formData,
        profileImageUrl: profileImage,
        headline: formData.position && formData.currentCompany ? `${formData.position} at ${formData.currentCompany}` : profile?.headline
      } as any)
      toast.success('Profile updated successfully!')
      onClose()
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [field]: value } }))
  }

  const addArrayItem = (field: 'skills' | 'achievements', value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }))
  }

  const removeArrayItem = (field: 'skills' | 'achievements', index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  const addProject = () => setFormData(prev => ({ ...prev, projects: [...prev.projects, { title: '', projectUrl: '', description: '', startDate: '', endDate: '' }] }))
  const removeProject = (index: number) => setFormData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }))
  const updateProject = (index: number, field: string, value: string) => {
    const newProjects = [...formData.projects]; newProjects[index][field] = value;
    setFormData(prev => ({ ...prev, projects: newProjects }))
  }

  const addCertification = () => setFormData(prev => ({ ...prev, certifications: [...prev.certifications, { name: '', issuer: '', issueDate: '', credentialUrl: '' }] }))
  const removeCertification = (index: number) => setFormData(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== index) }))
  const updateCertification = (index: number, field: string, value: string) => {
    const newCerts = [...formData.certifications]; newCerts[index][field] = value;
    setFormData(prev => ({ ...prev, certifications: newCerts }))
  }

  const addExperience = () => setFormData(prev => ({ ...prev, experiences: [...prev.experiences, { companyName: '', designation: '', location: '', startDate: '', endDate: '', current: false, description: '' }] }))
  const removeExperience = (index: number) => setFormData(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }))
  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...formData.experiences]; updated[index][field] = value;
    if (field === 'current' && value === true) updated[index].endDate = '';
    setFormData(prev => ({ ...prev, experiences: updated }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
              <h2 className="text-xl font-bold text-gray-900">Complete Profile</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Content Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Mobile Image Upload */}
              <div className="flex flex-col items-center sm:hidden mb-6">
                <div className="relative group cursor-pointer inline-block" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-100"><User size={32} className="text-primary-500" /></div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              {/* Form Grid Layout */}
              <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Left Column */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Desktop Image Upload */}
                  <div className="hidden sm:flex flex-col items-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-50"><User size={40} className="text-primary-400" /></div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         {isUploading ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Camera className="w-8 h-8 text-white" />}
                      </div>
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                      Change Photo
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">JPG, PNG or GIF. Max size 5MB.</p>
                  </div>

                  {/* Social Links */}
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                    <h3 className="font-semibold text-gray-900">Social Links</h3>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn URL</label>
                      <input value={formData.socialLinks.linkedin || ''} onChange={(e) => handleSocialChange('linkedin', e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" placeholder="https://linkedin.com/in/..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">GitHub URL</label>
                      <input value={formData.socialLinks.github || ''} onChange={(e) => handleSocialChange('github', e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" placeholder="https://github.com/..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Portfolio (Website)</label>
                      <input value={formData.socialLinks.portfolio || ''} onChange={(e) => handleSocialChange('portfolio', e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" placeholder="https://..." />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                    <h3 className="font-semibold text-gray-900">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
                          <span className="font-medium text-gray-700 mr-2">{skill}</span>
                          <button onClick={() => removeArrayItem('skills', index)} className="text-red-400 hover:text-red-600"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                       <input id="modalSkill" type="text" placeholder="Add skill..." className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addArrayItem('skills', e.currentTarget.value); e.currentTarget.value = ''; } }} />
                       <button type="button" onClick={() => { const input = document.getElementById('modalSkill') as HTMLInputElement; addArrayItem('skills', input.value); input.value = ''; }} className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-200">Add</button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">First Name *</label>
                        <input value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Last Name *</label>
                        <input value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Branch</label>
                        <input value={formData.branch} onChange={(e) => handleInputChange('branch', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Batch Year</label>
                        <input value={formData.batchYear} onChange={(e) => handleInputChange('batchYear', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Bio / About Me</label>
                        <textarea value={formData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} rows={3} placeholder="Write a short summary..." className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Current Job Title</label>
                        <input value={formData.position} onChange={(e) => handleInputChange('position', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
                        <input value={formData.currentCompany} onChange={(e) => handleInputChange('currentCompany', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                        <input value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white" />
                      </div>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">Projects</h3>
                      <button onClick={addProject} className="text-primary-600 hover:text-primary-800 text-sm font-semibold flex items-center bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 transition-colors">
                         <Plus size={16} className="mr-1" /> Add Project
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.projects.map((proj, index) => (
                        <div key={index} className="bg-white p-5 border border-gray-200 rounded-xl relative group shadow-sm">
                          <button onClick={() => removeProject(index)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-opacity bg-white/80"><Trash2 size={18} /></button>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Project Name *</label>
                              <input value={proj.title} onChange={e => updateProject(index, 'title', e.target.value)} required placeholder="e.g. Next.js Analytics App" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                            <div className="sm:col-span-2">
                               <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Project URL</label>
                               <input type="url" value={proj.projectUrl} onChange={e => updateProject(index, 'projectUrl', e.target.value)} placeholder="https://..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                            <div className="sm:col-span-2">
                               <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Description</label>
                               <textarea value={proj.description} onChange={e => updateProject(index, 'description', e.target.value)} rows={2} placeholder="Explain what you built..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                          </div>
                        </div>
                      ))}
                      {formData.projects.length === 0 && <p className="text-sm text-gray-500 text-center py-4 bg-white rounded-lg border border-dashed border-gray-200">Showcase your best projects!</p>}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">Certifications</h3>
                      <button onClick={addCertification} className="text-primary-600 hover:text-primary-800 text-sm font-semibold flex items-center bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 transition-colors">
                         <Plus size={16} className="mr-1" /> Add Certificate
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.certifications.map((cert, index) => (
                        <div key={index} className="bg-white p-5 border border-gray-200 rounded-xl relative group shadow-sm">
                          <button onClick={() => removeCertification(index)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-opacity bg-white/80"><Trash2 size={18} /></button>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Name *</label>
                              <input value={cert.name} onChange={e => updateCertification(index, 'name', e.target.value)} required placeholder="e.g. AWS Developer" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                            <div>
                               <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Organization *</label>
                               <input value={cert.issuer} onChange={e => updateCertification(index, 'issuer', e.target.value)} required placeholder="e.g. Amazon" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                            <div>
                               <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Credential URL</label>
                               <input type="url" value={cert.credentialUrl} onChange={e => updateCertification(index, 'credentialUrl', e.target.value)} placeholder="https://..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                            <div>
                               <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Issue Date</label>
                               <input value={cert.issueDate} onChange={e => updateCertification(index, 'issueDate', e.target.value)} placeholder="e.g. Aug 2023" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                          </div>
                        </div>
                      ))}
                      {formData.certifications.length === 0 && <p className="text-sm text-gray-500 text-center py-4 bg-white rounded-lg border border-dashed border-gray-200">Add your verified certifications!</p>}
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">Work Experience</h3>
                      <button onClick={addExperience} className="text-primary-600 hover:text-primary-800 text-sm font-semibold flex items-center bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 transition-colors">
                         <Plus size={16} className="mr-1" /> Add Experience
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.experiences.map((exp: any, index: number) => (
                        <div key={index} className="bg-white p-5 border border-gray-200 rounded-xl relative group shadow-sm">
                          <button onClick={() => removeExperience(index)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-opacity bg-white/80"><Trash2 size={18} /></button>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Job Title *</label>
                              <input value={exp.designation} onChange={e => updateExperience(index, 'designation', e.target.value)} required placeholder="e.g. Software Engineer" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                            <div>
                               <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Company *</label>
                               <input value={exp.companyName} onChange={e => updateExperience(index, 'companyName', e.target.value)} required placeholder="e.g. Google" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                            <div>
                               <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Location</label>
                               <input value={exp.location || ''} onChange={e => updateExperience(index, 'location', e.target.value)} placeholder="e.g. Bangalore" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                            <div className="flex items-center gap-2 pt-5">
                               <input type="checkbox" checked={exp.current} onChange={e => updateExperience(index, 'current', e.target.checked)} id={`modal-current-${index}`} className="rounded" />
                               <label htmlFor={`modal-current-${index}`} className="text-sm text-gray-700">Currently working here</label>
                            </div>
                            <div>
                               <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Start Date</label>
                               <input type="date" value={exp.startDate || ''} onChange={e => updateExperience(index, 'startDate', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                            {!exp.current && (
                              <div>
                                 <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">End Date</label>
                                 <input type="date" value={exp.endDate || ''} onChange={e => updateExperience(index, 'endDate', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                              </div>
                            )}
                            <div className="sm:col-span-2">
                               <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Description</label>
                               <textarea value={exp.description || ''} onChange={e => updateExperience(index, 'description', e.target.value)} rows={2} placeholder="Describe your responsibilities..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                          </div>
                        </div>
                      ))}
                      {formData.experiences.length === 0 && <p className="text-sm text-gray-500 text-center py-4 bg-white rounded-lg border border-dashed border-gray-200">Add your work experience!</p>}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-100 bg-white">
              <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="flex items-center justify-center min-w-[140px] space-x-2 px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-70 shadow-sm"
              >
                {isSaving ? <><Loader2 size={18} className="animate-spin" /><span>Saving...</span></> : <><Save size={18} /><span>Save Changes</span></>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
