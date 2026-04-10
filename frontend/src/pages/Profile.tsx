import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Camera, MapPin, Briefcase, GraduationCap, X, Check, Award, Link as LinkIcon, Plus, Trash2 } from 'lucide-react'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/contexts/ProfileContext'
import { profileImageAPI } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user } = useAuth()
  const { profile, isLoadingProfile, isSaving, updateProfile } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
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

  // Synchronize dynamic form states gracefully without crashes
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        branch: profile.branch || '',
        batchYear: profile.batchYear || '',
        currentCompany: profile.currentCompany || '',
        position: profile.position || '',
        location: profile.location || '',
        bio: profile.bio || '',
        skills: profile.skills || [],
        achievements: profile.achievements || [],
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || '',
          github: profile.socialLinks?.github || '',
          portfolio: profile.socialLinks?.portfolio || ''
        },
        projects: profile.projects || [],
        certifications: profile.certifications || [],
        experiences: profile.experiences || []
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }))
  }

  // --- Dynamic Array Handlers ---
  const addArrayItem = (field: 'skills' | 'achievements', value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }))
  }

  const removeArrayItem = (field: 'skills' | 'achievements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  // Projects
  const addProject = () => setFormData(prev => ({ ...prev, projects: [...prev.projects, { title: '', projectUrl: '', description: '', startDate: '', endDate: '' }] }))
  const removeProject = (index: number) => setFormData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }))
  const updateProject = (index: number, field: string, value: string) => {
    const newProjects = [...formData.projects]
    newProjects[index][field] = value
    setFormData(prev => ({ ...prev, projects: newProjects }))
  }

  // Certifications
  const addCertification = () => setFormData(prev => ({ ...prev, certifications: [...prev.certifications, { name: '', issuer: '', issueDate: '', credentialUrl: '' }] }))
  const removeCertification = (index: number) => setFormData(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== index) }))
  const updateCertification = (index: number, field: string, value: string) => {
    const newCerts = [...formData.certifications]
    newCerts[index][field] = value
    setFormData(prev => ({ ...prev, certifications: newCerts }))
  }

  // Experiences
  const addExperience = () => setFormData(prev => ({ ...prev, experiences: [...prev.experiences, { companyName: '', designation: '', location: '', startDate: '', endDate: '', current: false, description: '' }] }))
  const removeExperience = (index: number) => setFormData(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }))
  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...formData.experiences]
    updated[index][field] = value
    if (field === 'current' && value === true) updated[index].endDate = ''
    setFormData(prev => ({ ...prev, experiences: updated }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      if (!user) return;
      const response = await profileImageAPI.uploadImage(user.id || user.rollNumber, file)
      await updateProfile({ profileImageUrl: response.profileImageUrl } as any)
    } catch (error) {
      console.error('Failed to upload image:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Primitive Frontend Validation
    if (formData.projects.some(p => !p.title) || formData.certifications.some(c => !c.name || !c.issuer)) {
      toast.error('Please fill out all required fields for projects and certifications.')
      return
    }

    try {
      await updateProfile({
        ...formData,
        headline: formData.position && formData.currentCompany ? `${formData.position} at ${formData.currentCompany}` : profile?.headline,
      })
      setIsEditing(false)
    } catch {
      // Handled automatically via ProfileContext toaster
    }
  }

  if (isLoadingProfile || !profile) return <LoadingSpinner />
  if (!user) return <div className="min-h-screen pt-24 text-center">Please login to view your profile.</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />
      
      <div className="pt-24 container-custom max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Header Banner */}
          <div className="h-48 bg-gradient-to-r from-primary-600 to-indigo-800 relative">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors flex items-center space-x-2 z-20 shadow-sm"
              disabled={isSaving}
            >
              <Settings size={18} />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          </div>

          <div className="px-8 pb-8">
            <div className="relative -mt-20 mb-6 flex justify-between items-end">
              <div className="relative group z-10 block w-40 h-40 shrink-0">
                <img 
                  src={(profile as any).profileImageUrl || profile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.firstName)}+${encodeURIComponent(profile.lastName)}&size=200&background=1e40af&color=fff`}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-full h-full rounded-full border-4 border-white object-cover shadow-md bg-white"
                />
                
                {isEditing && (
                  <label className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploading ? <LoadingSpinner /> : (
                      <>
                        <Camera size={24} className="mb-2" />
                        <span className="text-sm font-medium">Change Photo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" required />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About Me</label>
                       <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Tell us about yourself..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                      <input name="branch" value={formData.branch} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                      <input name="batchYear" value={formData.batchYear} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Job Title</label>
                      <input name="position" value={formData.position} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input name="currentCompany" value={formData.currentCompany} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                      <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" />
                    </div>
                  </div>
                </div>

                {/* Work Experience */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Work Experience</h3>
                    <button type="button" onClick={addExperience} className="text-primary-600 hover:text-primary-800 text-sm font-semibold flex items-center">
                       <Plus size={16} className="mr-1" /> Add Experience
                    </button>
                  </div>
                  <div className="space-y-4">
                     {formData.experiences.map((exp: any, index: number) => (
                        <div key={index} className="bg-white p-4 border rounded-xl relative">
                           <button type="button" onClick={() => removeExperience(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                           <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Job Title / Designation *</label>
                                 <input value={exp.designation} onChange={e => updateExperience(index, 'designation', e.target.value)} required className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" placeholder="e.g. Software Engineer" />
                              </div>
                              <div className="pr-6">
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Company *</label>
                                 <input value={exp.companyName} onChange={e => updateExperience(index, 'companyName', e.target.value)} required className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" placeholder="e.g. Google" />
                              </div>
                              <div>
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                                 <input value={exp.location || ''} onChange={e => updateExperience(index, 'location', e.target.value)} className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" placeholder="e.g. Bangalore, India" />
                              </div>
                              <div className="flex items-center gap-2 pt-5">
                                 <input type="checkbox" checked={exp.current} onChange={e => updateExperience(index, 'current', e.target.checked)} id={`current-${index}`} className="rounded" />
                                 <label htmlFor={`current-${index}`} className="text-sm text-gray-700">I currently work here</label>
                              </div>
                              <div>
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                                 <input type="date" value={exp.startDate || ''} onChange={e => updateExperience(index, 'startDate', e.target.value)} className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" />
                              </div>
                              {!exp.current && (
                                <div>
                                   <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                                   <input type="date" value={exp.endDate || ''} onChange={e => updateExperience(index, 'endDate', e.target.value)} className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" />
                                </div>
                              )}
                              <div className="md:col-span-2">
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                 <textarea value={exp.description || ''} onChange={e => updateExperience(index, 'description', e.target.value)} rows={2} className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" placeholder="Describe your role and responsibilities..." />
                              </div>
                           </div>
                        </div>
                     ))}
                     {formData.experiences.length === 0 && <p className="text-sm text-gray-500 italic">No work experience added yet.</p>}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Social Links</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                       <input name="linkedin" value={formData.socialLinks.linkedin} onChange={handleSocialChange} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                       <input name="github" value={formData.socialLinks.github} onChange={handleSocialChange} placeholder="https://github.com/..." className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio / Website</label>
                       <input name="portfolio" value={formData.socialLinks.portfolio} onChange={handleSocialChange} placeholder="https://..." className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" />
                     </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                     {formData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1">
                           <span className="text-sm font-medium text-gray-700 mr-2">{skill}</span>
                           <button type="button" onClick={() => removeArrayItem('skills', index)} className="text-red-500 hover:text-red-700"><X size={14} /></button>
                        </div>
                     ))}
                  </div>
                  <div className="flex gap-2">
                     <input id="newSkill" type="text" placeholder="Add a skill (e.g. React, Python)" className="flex-1 px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addArrayItem('skills', e.currentTarget.value); e.currentTarget.value = ''; } }} />
                     <button type="button" onClick={() => { const input = document.getElementById('newSkill') as HTMLInputElement; addArrayItem('skills', input.value); input.value = ''; }} className="btn-secondary whitespace-nowrap">Add Skill</button>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Projects</h3>
                    <button type="button" onClick={addProject} className="text-primary-600 hover:text-primary-800 text-sm font-semibold flex items-center">
                       <Plus size={16} className="mr-1" /> Add Project
                    </button>
                  </div>
                  <div className="space-y-4">
                     {formData.projects.map((proj, index) => (
                        <div key={index} className="bg-white p-4 border rounded-xl relative">
                           <button type="button" onClick={() => removeProject(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                           <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Project Title *</label>
                                 <input value={proj.title} onChange={e => updateProject(index, 'title', e.target.value)} required className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" />
                              </div>
                              <div className="pr-6">
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Project Link (URL)</label>
                                 <input type="url" value={proj.projectUrl} onChange={e => updateProject(index, 'projectUrl', e.target.value)} className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" />
                              </div>
                              <div className="md:col-span-2">
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                 <textarea value={proj.description} onChange={e => updateProject(index, 'description', e.target.value)} rows={2} className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" />
                              </div>
                           </div>
                        </div>
                     ))}
                     {formData.projects.length === 0 && <p className="text-sm text-gray-500 italic">No projects added yet.</p>}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
                    <button type="button" onClick={addCertification} className="text-primary-600 hover:text-primary-800 text-sm font-semibold flex items-center">
                       <Plus size={16} className="mr-1" /> Add Certification
                    </button>
                  </div>
                  <div className="space-y-4">
                     {formData.certifications.map((cert, index) => (
                        <div key={index} className="bg-white p-4 border rounded-xl relative">
                           <button type="button" onClick={() => removeCertification(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                           <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
                                 <input value={cert.name} onChange={e => updateCertification(index, 'name', e.target.value)} required className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" />
                              </div>
                              <div className="pr-6">
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Issuer / Organization *</label>
                                 <input value={cert.issuer} onChange={e => updateCertification(index, 'issuer', e.target.value)} required className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" />
                              </div>
                              <div>
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Credential URL</label>
                                 <input type="url" value={cert.credentialUrl} onChange={e => updateCertification(index, 'credentialUrl', e.target.value)} className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" />
                              </div>
                              <div>
                                 <label className="block text-xs font-medium text-gray-500 mb-1">Issue Date</label>
                                 <input value={cert.issueDate} onChange={e => updateCertification(index, 'issueDate', e.target.value)} placeholder="e.g. Aug 2023" className="w-full px-3 py-1.5 border rounded focus:ring-1 focus:ring-primary-500" />
                              </div>
                           </div>
                        </div>
                     ))}
                     {formData.certifications.length === 0 && <p className="text-sm text-gray-500 italic">No certifications added yet.</p>}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t sticky bottom-0 bg-white py-4 z-10 shadow-up">
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost flex items-center space-x-2">
                    <X size={18} /><span>Cancel</span>
                  </button>
                  <button type="submit" className="btn-primary flex items-center space-x-2 min-w-[140px] justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" disabled={isSaving}>
                    {isSaving ? <LoadingSpinner /> : <><Check size={18} /><span>Save Profile</span></>}
                  </button>
                </div>
              </form>
            ) : (
              <div className="animate-in fade-in duration-500">
                <div className="mt-2 text-left block">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-lg text-gray-700 font-medium mt-1">
                    {profile.headline || `${profile.role === 'alumni' ? 'Alumni' : 'Student'} at PIEMR`}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm text-gray-600">
                    {profile.location && (
                      <div className="flex items-center text-gray-500">
                        <MapPin size={16} className="mr-1.5" />
                        {profile.location}
                      </div>
                    )}
                    {profile.branch && (
                      <div className="flex items-center text-gray-500">
                        <GraduationCap size={16} className="mr-1.5" />
                        {profile.branch} 
                        {profile.batchYear && <span className="ml-1">• Batch of {profile.batchYear}</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mt-8">
                  {/* Main Read-Only Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {profile.bio && (
                      <section className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                        <p className="whitespace-pre-line text-gray-600 leading-relaxed">{profile.bio}</p>
                      </section>
                    )}

                    {profile.experiences && profile.experiences.length > 0 && (
                      <section className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-6">
                          <Briefcase className="text-gray-400" size={24} />
                          <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
                        </div>
                        <div className="space-y-6">
                          {profile.experiences.map((exp: any, idx: number) => (
                            <div key={idx} className="border-l-2 border-primary-300 pl-4">
                              <h3 className="text-lg font-bold text-gray-900">{exp.designation}</h3>
                              <p className="text-primary-600 font-semibold">{exp.companyName}</p>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                {exp.location && <span className="flex items-center gap-1"><MapPin size={12} />{exp.location}</span>}
                                <span>
                                  {exp.startDate} — {exp.current ? 'Present' : (exp.endDate || 'N/A')}
                                </span>
                              </div>
                              {exp.description && <p className="mt-2 text-gray-600 text-sm whitespace-pre-line leading-relaxed">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {profile.projects && profile.projects.length > 0 && (
                      <section className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-6">
                          <Briefcase className="text-gray-400" size={24} />
                          <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                        </div>
                        <div className="space-y-6">
                          {profile.projects.map((proj: any, idx: number) => (
                            <div key={idx} className="border-l-2 border-primary-300 pl-4">
                              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {proj.title}
                                {proj.projectUrl && (
                                  <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                                    <LinkIcon size={14} />
                                  </a>
                                )}
                              </h3>
                              <p className="mt-2 text-gray-600 text-sm whitespace-pre-line leading-relaxed">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Sidebar Read-Only Column */}
                  <div className="space-y-6">
                    {profile.skills && profile.skills.length > 0 && (
                      <section className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill: string, idx: number) => (
                            <span key={idx} className="px-3 py-1.5 bg-white shadow-sm text-gray-800 font-medium text-sm rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}

                    {profile.certifications && profile.certifications.length > 0 && (
                      <section className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Award className="text-gray-400" size={20} />
                          <h2 className="text-lg font-bold text-gray-900">Certifications</h2>
                        </div>
                        <div className="space-y-4">
                          {profile.certifications.map((cert: any, idx: number) => (
                            <div key={idx} className="flex gap-3 text-sm">
                              <div>
                                <h4 className="font-bold text-gray-900">{cert.name}</h4>
                                <p className="text-gray-700">{cert.issuer}</p>
                                {cert.credentialUrl && (
                                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-primary-600 font-semibold hover:underline mt-1 inline-block">
                                    View Credential
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
