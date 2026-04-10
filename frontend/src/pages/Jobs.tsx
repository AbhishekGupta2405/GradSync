
import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  DollarSign,
  Users,
  Briefcase,
  ExternalLink,
  ChevronDown,
  Plus,
  BookOpen,
  X
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { jobAPI, postAPI } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'internship' | 'contract'
  experience: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  postedBy: string
  postedDate: Date
  deadline: Date
  applicants: number
  isUrgent?: boolean
  companyLogo?: string
  jobLink?: string
}

export default function Jobs() {
  const { user, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showPostJob, setShowPostJob] = useState(false)
  const [jobPostError, setJobPostError] = useState<string | null>(null)
  const [jobPostSuccess, setJobPostSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch Jobs from backend
  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const data = await jobAPI.getJobs() as any[]
      
      const transformed: JobPosting[] = data.map((job: any) => ({
        id: job.jobId || job.id || Math.random().toString(),
        title: job.title || 'Untitled',
        company: job.company || 'Unknown Company',
        location: job.location || 'Remote',
        type: (job.type?.toLowerCase() || job.jobType?.toLowerCase() || 'full-time') as any,
        experience: job.experienceLevel || 'Entry Level',
        salary: job.salaryRange || 'Not disclosed',
        description: job.description || '',
        jobLink: job.jobLink || '',
        requirements: job.requirements ? job.requirements.split('\n') : [],
        benefits: [],
        postedBy: job.postedBy || 'Alumni Network',
        postedDate: new Date(job.createdAt || Date.now()),
        deadline: new Date(job.deadline || new Date(Date.now() + 30*24*60*60*1000)),
        applicants: 0,
        isUrgent: false,
      })).reverse()

      setJobPostings(transformed)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
     
  }, [])

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setJobPostError(null)
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const newJob = {
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as string,
      experienceLevel: formData.get('experience') as string,
      salaryRange: formData.get('salary') as string,
      description: formData.get('description') as string,
      jobLink: formData.get('jobLink') as string,
      requirements: formData.get('requirements') as string,
      postedBy: user?.firstName + ' ' + user?.lastName || 'Alumni'
    }

    try {
      await jobAPI.createJob(newJob)
      
      try {
         await postAPI.createPost({
           authorId: user?.id || 'anonymous-alumni',
           content: `📢 I just posted a new Job opportunity for **${newJob.title}** at **${newJob.company}**.\n\n📍 Location: ${newJob.location}\n💼 Level: ${newJob.experienceLevel}\n\nCheck out the Jobs tab for more details!`,
           category: 'JOB_UPDATE',
           link: newJob.jobLink
         })
      } catch(e) {
         console.error('Failed to post to feeds:', e)
      }

      setJobPostSuccess(true)
      setShowPostJob(false)
      setIsSubmitting(false)
      fetchJobs() // Refresh list
      setTimeout(() => setJobPostSuccess(false), 4000)
    } catch (err: any) {
      console.error('Failed to post job:', err)
      setJobPostError(err?.message || 'Failed to post job. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this job posting?")) return;
    try {
      await jobAPI.deleteJob(jobId)
      setJobPostings(prev => prev.filter(job => job.id !== jobId))
    } catch(err) {
      console.error("Failed to delete job:", err)
      alert("Failed to delete the job posting.")
    }
  }

  const jobTypes = ['full-time', 'part-time', 'internship', 'contract']
  const locations = Array.from(new Set(jobPostings.map(job => job.location)))
  const experienceLevels = Array.from(new Set(jobPostings.map(job => job.experience)))

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobPostings.filter(job => {
      const matchesSearch = searchTerm === '' || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedType === '' || job.type === selectedType
      const matchesLocation = selectedLocation === '' || job.location === selectedLocation
      const matchesExperience = selectedExperience === '' || job.experience === selectedExperience

      return matchesSearch && matchesType && matchesLocation && matchesExperience
    })
  }, [searchTerm, selectedType, selectedLocation, selectedExperience, jobPostings])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('')
    setSelectedLocation('')
    setSelectedExperience('')
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-700'
      case 'part-time': return 'bg-blue-100 text-blue-700'
      case 'internship': return 'bg-purple-100 text-purple-700'
      case 'contract': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getDaysLeft = (deadline: Date) => {
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Success Banner */}
      {jobPostSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          ✅ Job posted successfully!
        </div>
      )}

      <div className="pt-16">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="container-custom py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Portal</h1>
                <p className="text-xl text-gray-600 max-w-3xl">
                  Discover exclusive job opportunities shared by PIEMR alumni. Find your next career move or help fellow graduates.
                </p>
              </div>
              
              {isAuthenticated && ['admin', 'alumni'].includes(user?.role || '') && (
                <button
                  onClick={() => setShowPostJob(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Post Job</span>
                </button>
              )}
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                  <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Types</option>
                      {jobTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <select
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Levels</option>
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Results */}
        <div className="container-custom py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing {filteredJobs.length} of {jobPostings.length} jobs
            </p>
            <div className="flex items-center space-x-2">
              <Briefcase size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">{filteredJobs.length} opportunities</span>
            </div>
          </div>

          {/* Job Listings border wrapper */}
          {isLoading ? (
            <div className="py-24"><LoadingSpinner /></div>
          ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {/* Company Logo */}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {job.companyLogo ? (
                          <img src={job.companyLogo} alt={job.company} className="w-8 h-8 object-contain" />
                        ) : (
                          <Building size={20} className="text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Job Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                {job.title}
                              </h3>
                              {job.isUrgent && (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-semibold text-primary-600">{job.company}</p>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>
                              {job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}
                            </span>
                            {user?.role === 'admin' && (
                              <button onClick={() => handleDeleteJob(job.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full cursor-pointer transition-colors" title="Delete Job">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-2" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <BookOpen size={14} className="mr-2" />
                            <span>{job.experience}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign size={14} className="mr-2" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center">
                            <Users size={14} className="mr-2" />
                            <span>{job.applicants} applicants</span>
                          </div>
                        </div>

                        {/* Job Description */}
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {job.description}
                        </p>

                        {/* Requirements Preview */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Requirements:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.slice(0, 3).map((req, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                {req}
                              </span>
                            ))}
                            {job.requirements.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{job.requirements.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <span>Posted by {job.postedBy}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(job.postedDate)}</span>
                            <span className="mx-2">•</span>
                            <span className={`${getDaysLeft(job.deadline) <= 7 ? 'text-red-600 font-medium' : ''}`}>
                              {getDaysLeft(job.deadline)} days left
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="ml-6 flex-shrink-0">
                    <a 
                      href={job.jobLink && job.jobLink.startsWith('http') ? job.jobLink : `https://${job.jobLink || '#'}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary flex items-center space-x-2 group"
                    >
                      <span>Apply Now</span>
                      <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                Be the first to post a new opportunity to the network!
              </p>
              <button
                onClick={() => setShowPostJob(true)}
                className="btn-primary"
              >
                Post Job
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostJob && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Post an Opportunity</h2>
              <button onClick={() => setShowPostJob(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input name="title" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="e.g. Software Engineer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input name="company" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="e.g. Google" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input name="location" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="e.g. Remote / Bangalore" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                  <input name="salary" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="e.g. $100k - $120k (Optional)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select name="type" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="FULL-TIME">Full-Time</option>
                    <option value="PART-TIME">Part-Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  <select name="experience" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Link / Application URL</label>
                <input name="jobLink" required type="url" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="https://company.com/apply/job-id" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea name="description" required rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Describe the role..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                <textarea name="requirements" rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 resize-none" placeholder="- 3+ years React experience\n- Strong Typescript skills"></textarea>
              </div>
              {jobPostError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  ❌ {jobPostError}
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => { setShowPostJob(false); setJobPostError(null) }} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
