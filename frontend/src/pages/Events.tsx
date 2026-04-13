import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, MapPin, Clock, Users, Search,
  X
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { eventsAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function Events() {
  const { user } = useAuth()
  
  const [events, setEvents] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '', description: '', date: '', time: '',
    location: '', type: 'networking', category: '',
    price: 'Free', capacity: 100, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop'
  })

  // Local interaction states
  const [registeringIds, setRegisteringIds] = useState<Record<number, boolean>>({})
  const [registeredCache, setRegisteredCache] = useState<Record<number, boolean>>({})

  const fetchEvents = async () => {
    try {
      const data = await eventsAPI.getEvents() as any[]
      const hydrated = Array.isArray(data) ? data.map((e: any) => ({
        ...e,
        organizer: {
          name: e.organizerName || 'GradSync Organizer',
          avatar: e.organizerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(e.organizerName || 'O')}&background=random&color=fff`
        },
        tags: [e.type, e.category].filter(Boolean),
        registered: e.registered || 0,
        capacity: e.capacity || 100,
        price: e.price || 'Free',
        image: e.image || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop'
      })) : []
      setEvents(hydrated)
      setFilteredEvents(hydrated)
    } catch (err) {
      console.error("Failed to fetch events:", err)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
     
  }, [])

  useEffect(() => {
    let filtered = events

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredEvents(filtered)
  }, [selectedType, searchQuery, events])

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await eventsAPI.createEvent({
        ...newEvent,
        organizerName: user ? `${user.firstName} ${user.lastName}` : 'Alumni Member',
        organizerAvatar: user?.profileImage || null,
        featured: false, // New events default to non-featured
        registered: 0
      })
      await fetchEvents()
      setShowCreateModal(false)
      setNewEvent({ ...newEvent, title: '', description: '' }) // basic reset
    } catch (error) {
      console.error('Failed to create event:', error)
      alert("Failed to create event.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (eventId: number) => {
    if (registeredCache[eventId]) return
    
    setRegisteringIds(prev => ({ ...prev, [eventId]: true }))
    try {
      await eventsAPI.registerForEvent(eventId)
      
      // Update local UI immediately so it looks fast
      setEvents(prev => prev.map(ev => 
        ev.id === eventId ? { ...ev, registered: ev.registered + 1 } : ev
      ))
      setRegisteredCache(prev => ({ ...prev, [eventId]: true }))
      
    } catch (error: any) {
      console.error('Failed to register:', error)
      alert("Registration failed. The core backend container might still be booting up!")
    } finally {
      setRegisteringIds(prev => ({ ...prev, [eventId]: false }))
    }
  }

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm("Are you sure you want to permanently remove this event?")) return;
    try {
      await eventsAPI.deleteEvent(eventId)
      setEvents(prev => prev.filter(ev => ev.id !== eventId))
    } catch(err) {
      console.error("Failed to delete event:", err)
      alert("Failed to delete the event.")
    }
  }

  // Dynamic Metrics Generation
  const activeTypes = [
    { id: 'all', name: 'All Events', count: events.length },
    { id: 'networking', name: 'Networking', count: events.filter(e => e.type === 'networking').length },
    { id: 'workshop', name: 'Workshops', count: events.filter(e => e.type === 'workshop').length },
    { id: 'seminar', name: 'Seminars', count: events.filter(e => e.type === 'seminar').length },
    { id: 'sports', name: 'Sports', count: events.filter(e => e.type === 'sports').length }
  ]



  const featuredEvents = filteredEvents.filter(event => event.featured)
  const regularEvents = filteredEvents.filter(event => !event.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 pt-24 pb-40">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative z-20">
          <div className="text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Connect. Learn. <span className="text-golden-400">Grow.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 mb-12 max-w-4xl mx-auto"
            >
              Join exclusive events designed for PIEMR alumni. Network with industry leaders, 
              enhance your skills, and give back to the community that shaped your future.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button 
                onClick={() => document.getElementById('events-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary bg-golden-500 hover:bg-golden-600 border-0"
              >
                Browse Events
              </button>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="btn-secondary border-2 border-white/30 text-white hover:bg-white/10"
                >
                  Host an Event
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Search and Filters */}
      <main id="events-grid" className="py-16">
        <section className="py-8 bg-white border-b mb-8">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                {activeTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedType === type.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.name} ({type.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container-custom">
          {!loading && events.length === 0 ? (
             <div className="text-center py-16">
                <Calendar className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Events</h2>
                <p className="text-gray-500 mb-6">Looks like nothing is currently scheduled in the main database.</p>
                <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                   Be the first to Host an Event
                </button>
             </div>
          ) : (
            <div className="space-y-16">
              {featuredEvents.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {Array.isArray(featuredEvents) && featuredEvents.map((event) => (
                      <EventCard key={event.id} event={event} onRegister={handleRegister} onDelete={handleDeleteEvent} registering={registeringIds[event.id]} isRegistered={registeredCache[event.id]} isAdmin={user?.role === 'admin'} />
                    ))}
                  </div>
                </div>
              )}

              {regularEvents.length > 0 && (
                 <div>
                   <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {Array.isArray(regularEvents) && regularEvents.map((event) => (
                        <EventCard key={event.id} event={event} onRegister={handleRegister} onDelete={handleDeleteEvent} registering={registeringIds[event.id]} isRegistered={registeredCache[event.id]} isAdmin={user?.role === 'admin'} compact />
                     ))}
                   </div>
                 </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* CREATE EVENT MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b sticky top-0 bg-white flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">Host New Event</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input required type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500"
                    placeholder="e.g. Annual Alumni Meetup"
                    value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input required type="date" className="w-full rounded-lg border-gray-300 shadow-sm"
                      value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input required type="time" className="w-full rounded-lg border-gray-300 shadow-sm"
                      value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input required type="text" className="w-full rounded-lg border-gray-300 shadow-sm"
                      placeholder="e.g. Campus grounds or Zoom link"
                      value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                    <input required type="number" min="1" className="w-full rounded-lg border-gray-300 shadow-sm"
                      value={newEvent.capacity} onChange={e => setNewEvent({...newEvent, capacity: parseInt(e.target.value)})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Type</label>
                    <select className="w-full rounded-lg border-gray-300 shadow-sm"
                      value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                      <option value="networking">Networking</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="sports">Sports / Fun</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shorthand Category Label</label>
                    <input required type="text" className="w-full rounded-lg border-gray-300 shadow-sm"
                      placeholder="e.g. Masterclass, Party..."
                      value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea required rows={4} className="w-full rounded-lg border-gray-300 shadow-sm"
                    placeholder="Describe the value of the event..."
                    value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary px-6">
                    {isSubmitting ? 'Publishing...' : 'Publish Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EventCard({ event, compact = false, onRegister, onDelete, registering, isRegistered, isAdmin }: { event: any, compact?: boolean, onRegister: (id: number) => void, onDelete?: (id: number) => void, registering: boolean, isRegistered: boolean, isAdmin?: boolean }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden group">
      <div className="relative">
        <img src={event.image} alt={event.title} className={`w-full ${compact ? 'h-40' : 'h-48'} object-cover group-hover:scale-105 transition-transform duration-300`} />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
            {event.category || event.type}
          </span>
        </div>
        {isAdmin && onDelete && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onDelete(event.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow cursor-pointer">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors`}>
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            {event.date}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Users className="w-4 h-4 mr-2" />
            <span className={event.registered >= event.capacity ? 'text-red-500' : 'text-green-600'}>
              {event.registered}/{event.capacity} registered
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <img src={event.organizer.avatar} className="w-8 h-8 rounded-full bg-gray-200" alt="" />
            <span className="text-sm text-gray-600 truncate max-w-[100px]">{event.organizer.name}</span>
          </div>
          <button 
            disabled={registering || isRegistered || event.registered >= event.capacity}
            onClick={() => onRegister(event.id)} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              isRegistered 
                ? 'bg-green-100 text-green-700' 
                : event.registered >= event.capacity
                  ? 'bg-red-100 text-red-700'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isRegistered ? 'Going!' : event.registered >= event.capacity ? 'Full' : registering ? 'Wait...' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  )
}