import React, { useState, useEffect } from 'react'
import { adminAPI, jobAPI, eventsAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, XCircle, Trash2, Clock, GraduationCap, Building, Plus, Edit } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Data states
  const [pending, setPending] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [alumni, setAlumni] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pend, stud, alum, jobsRes, eventsRes] = await Promise.all([
        adminAPI.getPendingVerifications(),
        adminAPI.getStudents(),
        adminAPI.getAlumni(),
        jobAPI.getJobs(),
        eventsAPI.getEvents()
      ])
      setPending(pend || [])
      setStudents(stud || [])
      setAlumni(alum || [])
      setJobs(jobsRes || [])
      setEvents(eventsRes || [])
    } catch {
      toast.error("Failed to load dashboard data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- User Handlers ---
  const handleVerify = async (userId: string) => {
    try {
      await adminAPI.verifyUser(userId)
      toast.success("User verified successfully")
      fetchData()
    } catch {
      toast.error("Failed to verify user")
    }
  }

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This cascades through all their data.")) return;
    try {
      await adminAPI.deleteUser(userId)
      toast.success("User deletion saga triggered")
      fetchData()
    } catch {
      toast.error("Failed to trigger deletion")
    }
  }

  // --- Job Handlers ---
  const handleSaveJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const rawData = Object.fromEntries(formData.entries())
    
    const jobData = {
       ...rawData,
       postedBy: selectedJob?.postedBy || user?.id || 'Admin'
    }
    
    try {
      if (selectedJob?.id) {
        await jobAPI.updateJob(selectedJob.id, jobData)
        toast.success("Job updated successfully")
      } else {
        await jobAPI.createJob(jobData)
        toast.success("Job created successfully")
      }
      setIsJobModalOpen(false)
      fetchData()
    } catch {
      toast.error("Failed to save job")
    }
  }

  const handleDeleteJob = async (id: string | number) => {
    if(!window.confirm("Delete this job?")) return;
    try {
      await jobAPI.deleteJob(id)
      toast.success("Job deleted successfully")
      fetchData()
    } catch {
      toast.error("Failed to delete job")
    }
  }

  // --- Event Handlers ---
  const handleSaveEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const eventData = Object.fromEntries(formData.entries())

    try {
      if (selectedEvent?.id) {
        await eventsAPI.updateEvent(selectedEvent.id, eventData)
        toast.success("Event updated successfully")
      } else {
        await eventsAPI.createEvent(eventData)
        toast.success("Event created successfully")
      }
      setIsEventModalOpen(false)
      fetchData()
    } catch {
      toast.error("Failed to save event")
    }
  }

  const handleDeleteEvent = async (id: string | number) => {
    if(!window.confirm("Delete this event?")) return;
    try {
      await eventsAPI.deleteEvent(id)
      toast.success("Event deleted successfully")
      fetchData()
    } catch {
      toast.error("Failed to delete event")
    }
  }

  // --- Renders ---
  const renderUserTable = (data: any[], type: string) => {
    if (loading) return <div className="text-center p-8 text-neutral-500">Loading directory...</div>
    
    const filteredData = data.filter(row => 
       `${row.firstName} ${row.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (row.branch && row.branch.toLowerCase().includes(searchTerm.toLowerCase())) ||
       (row.userId && row.userId.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    if (filteredData.length === 0) return <div className="text-center p-8 text-neutral-500">No {type} found.</div>

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-sm font-semibold text-neutral-700">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Branch / Year</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredData.map((row) => (
              <tr key={row.userId} className="hover:bg-neutral-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-neutral-900">{row.firstName} {row.lastName}</div>
                  <div className="text-xs text-neutral-500">{row.userId.substring(0, 8)}...</div>
                </td>
                <td className="p-4 text-sm text-neutral-600">
                  {row.branch} <br/>
                  <span className="text-xs text-neutral-400">Class of {row.batchYear || 'N/A'}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.role === 'ALUMNI' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {row.role}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-end">
                  {type === 'pending' && (
                    <button onClick={() => handleVerify(row.userId)} className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                      <CheckCircle className="w-5 h-5"/>
                    </button>
                  )}
                  <button onClick={() => handleDelete(row.userId)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 className="w-5 h-5"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderJobsTable = () => {
    const filteredJobs = jobs.filter((job: any) => 
       job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.type?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Job Board Management</h2>
            <button 
               onClick={() => { setSelectedJob(null); setIsJobModalOpen(true); }}
               className="btn-primary flex items-center gap-2">
                <Plus size={16}/> Post Job
            </button>
        </div>
        {loading ? <div className="text-center p-8 text-neutral-500">Loading jobs...</div> :
         filteredJobs.length === 0 ? <div className="text-center p-8 text-neutral-500">No jobs found matching search.</div> :
         (
         <div className="overflow-x-auto">
            <table className="w-full text-left bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-sm font-semibold text-neutral-700">
                <tr>
                <th className="p-4">Role</th>
                <th className="p-4">Company</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
                {filteredJobs.map((job: any) => (
                <tr key={job.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-medium text-neutral-900">{job.title}</td>
                    <td className="p-4 text-sm text-neutral-600">{job.company}</td>
                    <td className="p-4 text-sm text-neutral-600">{job.type}</td>
                    <td className="p-4 flex gap-2 justify-end">
                    <button onClick={() => { setSelectedJob(job); setIsJobModalOpen(true); }} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        <Edit className="w-5 h-5"/>
                    </button>
                    <button onClick={() => handleDeleteJob(job.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                        <Trash2 className="w-5 h-5"/>
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
         </div>
         )}
      </div>
    )
  }

  const renderEventsTable = () => {
    const filteredEvents = events.filter((evt: any) => 
       evt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       evt.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       evt.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Events Management</h2>
            <button 
               onClick={() => { setSelectedEvent(null); setIsEventModalOpen(true); }}
               className="btn-primary flex items-center gap-2">
                <Plus size={16}/> Create Event
            </button>
        </div>
        {loading ? <div className="text-center p-8 text-neutral-500">Loading events...</div> :
         filteredEvents.length === 0 ? <div className="text-center p-8 text-neutral-500">No events found matching search.</div> :
         (
         <div className="overflow-x-auto">
            <table className="w-full text-left bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-sm font-semibold text-neutral-700">
                <tr>
                <th className="p-4">Event Title</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
                {filteredEvents.map((evt: any) => (
                <tr key={evt.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-medium text-neutral-900">{evt.title}</td>
                    <td className="p-4 text-sm text-neutral-600">{evt.date} @ {evt.time}</td>
                    <td className="p-4 text-sm text-neutral-600">{evt.type}</td>
                    <td className="p-4 flex gap-2 justify-end">
                    <button onClick={() => { setSelectedEvent(evt); setIsEventModalOpen(true); }} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        <Edit className="w-5 h-5"/>
                    </button>
                    <button onClick={() => handleDeleteEvent(evt.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                        <Trash2 className="w-5 h-5"/>
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
         </div>
         )}
      </div>
    )
  }

  // --- Modals ---
  const JobModal = () => isJobModalOpen ? (
    <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <h2 className="text-xl font-bold text-neutral-900">{selectedJob ? 'Edit Job' : 'Post New Job'}</h2>
          <button onClick={() => setIsJobModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors"><XCircle size={24}/></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <form id="jobForm" onSubmit={handleSaveJob} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Job Title</label>
                    <input name="title" defaultValue={selectedJob?.title} required className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Company</label>
                    <input name="company" defaultValue={selectedJob?.company} required className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                    <input name="location" defaultValue={selectedJob?.location} className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Employment Type</label>
                    <select name="type" defaultValue={selectedJob?.type || 'FULL_TIME'} className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="CONTRACT">Contract</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Experience Level</label>
                    <select name="experienceLevel" defaultValue={selectedJob?.experienceLevel || 'ENTRY'} className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="ENTRY">Entry Level</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="SENIOR">Senior</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Salary Range</label>
                    <input name="salaryRange" defaultValue={selectedJob?.salaryRange} placeholder="e.g. $50k - $70k" className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Job Link (Optional)</label>
                <input name="jobLink" defaultValue={selectedJob?.jobLink} type="url" placeholder="https://" className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <textarea name="description" defaultValue={selectedJob?.description} required rows={3} className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Requirements</label>
                <textarea name="requirements" defaultValue={selectedJob?.requirements} rows={2} className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </form>
        </div>
        <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
            <button onClick={() => setIsJobModalOpen(false)} className="px-4 py-2 text-neutral-600 font-medium hover:bg-neutral-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" form="jobForm" className="btn-primary">Save Job</button>
        </div>
      </div>
    </div>
  ) : null;

  const EventModal = () => isEventModalOpen ? (
    <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <h2 className="text-xl font-bold text-neutral-900">{selectedEvent ? 'Edit Event' : 'Create Event'}</h2>
          <button onClick={() => setIsEventModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors"><XCircle size={24}/></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <form id="eventForm" onSubmit={handleSaveEvent} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Event Title</label>
                <input name="title" defaultValue={selectedEvent?.title} required className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
                    <input name="date" type="date" defaultValue={selectedEvent?.date} required className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Time</label>
                    <input name="time" type="time" defaultValue={selectedEvent?.time} required className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                    <input name="location" defaultValue={selectedEvent?.location} required className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Event Type</label>
                    <select name="type" defaultValue={selectedEvent?.type || 'In-Person'} className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="In-Person">In-Person</option>
                        <option value="Virtual">Virtual</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Capacity</label>
                    <input name="capacity" type="number" defaultValue={selectedEvent?.capacity || 0} required className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Price (Leave blank if free)</label>
                    <input name="price" defaultValue={selectedEvent?.price || 'Free'} className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Organizer Name</label>
                <input name="organizerName" defaultValue={selectedEvent?.organizerName || 'GradSync Team'} required className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <textarea name="description" defaultValue={selectedEvent?.description} required rows={4} className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </form>
        </div>
        <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
            <button onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 text-neutral-600 font-medium hover:bg-neutral-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" form="eventForm" className="btn-primary">Save Event</button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="bg-neutral-50 min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right"/>
        <JobModal />
        <EventModal />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display text-neutral-900 tracking-tight">Admin Headquarters</h1>
            <p className="text-neutral-500 mt-1">Review pending applications and manage the active directory, jobs, and events.</p>
          </div>
        </div>

        {/* Stats Hero */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl"><Clock className="w-6 h-6 text-amber-600"/></div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{pending.length}</div>
              <div className="text-sm font-medium text-neutral-500">Pending Reviews</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl"><Building className="w-6 h-6 text-blue-600"/></div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{alumni.length}</div>
              <div className="text-sm font-medium text-neutral-500">Active Alumni</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl"><GraduationCap className="w-6 h-6 text-green-600"/></div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{students.length}</div>
              <div className="text-sm font-medium text-neutral-500">Active Students</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col justify-center gap-1">
             <div className="text-sm font-semibold text-neutral-700">Total Postings</div>
             <div className="text-xs text-neutral-500">{jobs.length} Active Jobs</div>
             <div className="text-xs text-neutral-500">{events.length} Scheduled Events</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-neutral-200">
          <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide pb-2 sm:pb-0 w-full sm:w-auto">
            <button onClick={() => { setActiveTab('pending'); setSearchTerm(''); }} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
              Pending ({pending.length})
            </button>
            <button onClick={() => { setActiveTab('students'); setSearchTerm(''); }} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'students' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
              Students ({students.length})
            </button>
            <button onClick={() => { setActiveTab('alumni'); setSearchTerm(''); }} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'alumni' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
              Alumni ({alumni.length})
            </button>
            <button onClick={() => { setActiveTab('jobs'); setSearchTerm(''); }} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
              Jobs ({jobs.length})
            </button>
            <button onClick={() => { setActiveTab('events'); setSearchTerm(''); }} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'events' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
              Events ({events.length})
            </button>
          </div>
          <div className="pb-3 pt-2 sm:pt-0 sm:pb-0 w-full sm:w-64 shrink-0">
             <input 
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
             />
          </div>
        </div>

        {/* Grid Content */}
        {activeTab === 'pending' && renderUserTable(pending, 'pending')}
        {activeTab === 'students' && renderUserTable(students, 'students')}
        {activeTab === 'alumni' && renderUserTable(alumni, 'alumni')}
        {activeTab === 'jobs' && renderJobsTable()}
        {activeTab === 'events' && renderEventsTable()}

        </div>
      </div>
      <Footer />
    </div>
  )
}
