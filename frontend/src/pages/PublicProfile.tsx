import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Building, 
  Briefcase,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Github,
  Linkedin,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { userAPI } from '@/lib/api'

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return
      
      try {
        setLoading(true)
        setError(null)
        const data = await userAPI.getPublicProfile(userId)
        setProfile(data)
      } catch (err: any) {
        console.error("Error fetching public profile:", err)
        setError(err.message || 'Profile not found or moved.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 container-custom py-12 px-4 sm:px-6 mt-16 max-w-5xl mx-auto w-full">
          {/* Skeleton Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 animate-pulse">
            <div className="h-48 bg-gray-200 w-full relative"></div>
            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-16 mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300"></div>
                <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          
          {/* Skeleton Body Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm h-48 bg-gray-100 animate-pulse"></div>
              <div className="bg-white rounded-2xl shadow-sm h-64 bg-gray-100 animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm h-64 bg-gray-100 animate-pulse"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-200"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Unavailable</h1>
            <p className="text-gray-600 mb-6">{error || 'This user does not exist or their account is private.'}</p>
            <Link to="/directory" className="btn-primary inline-block">
              Return to Directory
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container-custom py-8 px-4 sm:px-6 pt-24 max-w-5xl mx-auto w-full">
        {/* Profile Card Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 relative"
        >
          {/* Cover Photo Area - Gradient */}
          <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-900 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            {profile.isVerified && (
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                <span className="text-white text-xs font-semibold">Verified Member</span>
              </div>
            )}
          </div>
          
          <div className="px-6 md:px-8 pb-8">
            <div className="relative flex flex-col md:flex-row justify-between md:items-end -mt-16 md:-mt-20 mb-4 sm:mb-2 gap-4">
              <div className="relative inline-block z-10 w-32 h-32 md:w-40 md:h-40 shrink-0">
                <img
                  src={profile.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.firstName)}+${encodeURIComponent(profile.lastName)}&size=200&background=1e40af&color=fff`}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-full h-full rounded-full border-4 border-white object-cover shadow-md bg-white"
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {user && user.id !== userId && (
                  <button 
                    onClick={() => {
                      const basePath = user.role ? `/${user.role.toLowerCase()}` : '';
                      navigate(`${basePath}/messages?user=${userId}`, {
                        state: {
                          preselectProfile: {
                            id: profile.userId,
                            firstName: profile.firstName,
                            lastName: profile.lastName,
                            profileImageUrl: profile.profileImageUrl,
                            headline: profile.headline,
                          }
                        }
                      });
                    }}
                    className="flex-1 md:flex-none btn-primary flex items-center justify-center gap-2 py-2.5"
                  >
                    <MessageSquare size={18} />
                    <span>Message</span>
                  </button>
                )}
              </div>
            </div>

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
                    <Building size={16} className="mr-1.5" />
                    {profile.branch} 
                    {profile.batchYear && <span className="ml-1">• Batch of {profile.batchYear}</span>}
                  </div>
                )}
              </div>
            </div>
            
            {/* Social Links Row */}
            {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
                   {profile.socialLinks.linkedin && (
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary-600 transition">
                         <Linkedin size={20} />
                      </a>
                   )}
                   {profile.socialLinks.github && (
                      <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-900 transition">
                         <Github size={20} />
                      </a>
                   )}
                   {profile.socialLinks.portfolio && (
                      <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary-600 transition">
                         <LinkIcon size={20} />
                      </a>
                   )}
                </div>
            )}
          </div>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Section */}
            {profile.bio && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">About</h2>
                <div className="prose max-w-none text-gray-600">
                  <p className="whitespace-pre-line leading-relaxed">{profile.bio}</p>
                </div>
              </motion.section>
            )}

            {/* Experience Section */}
            {profile.experiences && profile.experiences.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="text-gray-400" size={24} />
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Experience</h2>
                </div>
                
                <div className="space-y-8">
                  {profile.experiences.map((exp: any, idx: number) => (
                    <div key={idx} className="relative pl-6 sm:pl-0">
                      {/* Timeline line on mobile */}
                      <div className="sm:hidden absolute left-0 top-2 bottom-0 w-px bg-gray-200"></div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Company Logo Placeholder */}
                        <div className="hidden sm:flex flex-shrink-0 w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg items-center justify-center shadow-sm">
                          <Building className="text-gray-400" size={24} />
                        </div>
                        
                        <div className="sm:flex-1 relative">
                          <div className="sm:hidden absolute -left-[29px] top-2 w-3 h-3 rounded-full bg-gray-300 border-2 border-white"></div>
                          
                          <h3 className="text-lg font-bold text-gray-900 leading-snug">{exp.designation}</h3>
                          <p className="text-gray-800 font-medium">{exp.companyName}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                            {exp.location && <span className="ml-2 inline-flex items-center">• {exp.location}</span>}
                          </p>
                          {exp.description && (
                            <p className="mt-3 text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Separator */}
                      {idx < profile.experiences.length - 1 && (
                        <div className="hidden sm:block border-b border-gray-100 mt-8 ml-18"></div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Education Section */}
            {profile.education && profile.education.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="text-gray-400" size={24} />
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Education</h2>
                </div>
                
                <div className="space-y-6">
                  {profile.education.map((edu: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                       <div className="flex-shrink-0 w-14 h-14 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center shadow-sm">
                          <GraduationCap className="text-blue-500" size={24} />
                        </div>
                       <div>
                          <h3 className="text-lg font-bold text-gray-900">{edu.institutionName}</h3>
                          <p className="text-gray-800 font-medium">{edu.degree}{edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}</p>
                          <p className="text-sm text-gray-500 mt-0.5">
                             {edu.startDate} – {edu.isCurrent ? (edu.expectedGraduationYear || 'Present') : edu.endDate}
                          </p>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
            
            {/* Projects Section */}
            {profile.projects && profile.projects.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <LinkIcon className="text-gray-400" size={24} />
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Projects</h2>
                </div>
                
                <div className="space-y-6">
                  {profile.projects.map((proj: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-primary-200 pl-4">
                       <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          {proj.title}
                          {proj.projectUrl && (
                             <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors">
                                <LinkIcon size={14} className="ml-1" />
                             </a>
                          )}
                       </h3>
                       <p className="text-sm text-gray-500 mt-0.5 mb-2">
                          {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ''}
                       </p>
                       {proj.description && (
                          <p className="mt-2 text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                            {proj.description}
                          </p>
                       )}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Skills Array */}
            {profile.skills && profile.skills.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Skills & Endorsements</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string, idx: number) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 font-medium text-sm rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Certifications Map */}
            {profile.certifications && profile.certifications.length > 0 && (
              <motion.section 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                 <div className="flex items-center gap-2 mb-4">
                  <Award className="text-gray-400" size={20} />
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Licenses & Certifications</h2>
                 </div>
                 <div className="space-y-4">
                    {profile.certifications.map((cert: any, idx: number) => (
                       <div key={idx} className="flex gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-golden-50 border border-golden-100 rounded flex items-center justify-center">
                             <Award className="text-golden-500" size={18} />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900 text-sm">{cert.name}</h4>
                             <p className="text-sm text-gray-700">{cert.issuer}</p>
                             <p className="text-xs text-gray-500 mt-0.5">Issued {cert.issueDate}</p>
                             {cert.credentialUrl && (
                                <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-primary-600 text-xs font-semibold hover:underline mt-1 inline-block">
                                   Show credential
                                </a>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </motion.section>
            )}

            {/* Accomplishments */}
            {profile.achievements && profile.achievements.length > 0 && (
               <motion.section 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
               >
                  <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Honors & Awards</h2>
                  <ul className="space-y-3">
                     {profile.achievements.map((acc: string, idx: number) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-700">
                           <span className="text-golden-500 shrink-0">✦</span>
                           <span>{acc}</span>
                        </li>
                     ))}
                  </ul>
               </motion.section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
