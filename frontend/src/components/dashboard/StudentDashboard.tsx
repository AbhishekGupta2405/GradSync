
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Users, 
  Briefcase, 
  Award,
  TrendingUp, 
  Calendar,
  Search,
  Bell,
  MapPin,
  Building,
  ExternalLink
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import { jobAPI, eventsAPI, userAPI, postAPI } from '@/lib/api'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [globalStats, setGlobalStats] = useState({ totalUsers: 0, totalJobs: 0, totalEvents: 0, totalMentors: 0 })
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsData, eventsData, directoryData, feedData] = await Promise.all([
          jobAPI.getJobs(),
          eventsAPI.getEvents(),
          userAPI.getDirectory(),
          postAPI.getFeed()
        ]);
        
        let usersCount = 0;
        let mentorsCount = 0;

        // Filter directory for alumni to use as mentors
        if (Array.isArray(directoryData)) {
          usersCount = directoryData.length;
          const alumniList = directoryData.filter((u: any) => u.role === 'alumni' || u.role === 'ALUMNI');
          mentorsCount = alumniList.length;
        }

        setGlobalStats({ 
          totalUsers: usersCount, 
          totalJobs: Array.isArray(jobsData) ? jobsData.length : 0, 
          totalEvents: Array.isArray(eventsData) ? eventsData.length : 0,
          totalMentors: mentorsCount
        });

        if (Array.isArray(jobsData)) setOpportunities(jobsData.slice(0, 3));
        if (Array.isArray(feedData)) setRecentActivities(feedData.slice(0, 4));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, [])

  const stats = [
    {
      icon: Users,
      label: 'Global Network',
      value: globalStats?.totalUsers || '...',
      change: 'Live tracking active',
      color: 'text-primary-500',
      bgColor: 'bg-primary-50'
    },
    {
      icon: Briefcase,
      label: 'Live Opportunities',
      value: globalStats?.totalJobs || '...',
      change: 'Discover your career',
      color: 'text-golden-500',
      bgColor: 'bg-golden-50'
    },
    {
      icon: Award,
      label: 'Active Events',
      value: globalStats?.totalEvents || '...',
      change: 'Join upcoming sessions',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: BookOpen,
      label: 'Connected Mentors',
      value: globalStats.totalMentors,
      change: 'Alumni ready to guide',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]





  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16">
        {/* Welcome Section */}
        <div className="gradient-primary text-white">
          <div className="container-custom py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1e40af&color=fff`}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                />
                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome, {user?.firstName}!
                  </h1>
                  <p className="text-primary-100">
                    {user?.branch} • Batch of {user?.batchYear} • Final Year
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                  <Bell size={20} />
                </button>
                <Link to="/student/profile" className="bg-white text-primary-500 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition-colors">
                  Update Profile
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                  <div className="text-xs text-green-600">{stat.change}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-1 gap-8">
            {/* Main Content */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Link to="/student/jobs" className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group">
                    <Search className="w-8 h-8 text-gray-400 group-hover:text-primary-500 mb-2" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-primary-600">Find Opportunities</span>
                  </Link>
                  <Link to="/student/directory" className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-golden-300 hover:bg-golden-50 transition-colors group">
                    <Users className="w-8 h-8 text-gray-400 group-hover:text-golden-500 mb-2" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-golden-600">Connect Alumni</span>
                  </Link>
                  <Link to="/student/events" className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group">
                    <Calendar className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mb-2" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Join Events</span>
                  </Link>
                </div>
              </motion.div>

              {/* Opportunities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Latest Opportunities</h2>
                  <Link to="/student/jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {opportunities.map((opportunity, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              opportunity.type === 'internship' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {opportunity.type === 'internship' ? 'Internship' : 'Full-time'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Building size={14} className="mr-1" />
                              {opportunity.jobType} • {opportunity.location}
                            </div>
                            <div className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              {opportunity.location}
                            </div>
                            <div>Salary: {opportunity.salary || 'Competitive'}</div>
                            <div>Experience: {opportunity.experienceLevel || 'Entry Level'}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              Deadline: {opportunity.deadline || 'Rolling basis'}
                            </div>
                          </div>
                        </div>
                        <Link to="/student/jobs" className="btn-primary text-sm px-4 py-2 flex items-center space-x-1 ml-4">
                          <span>Apply</span>
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <Link to="/student/feed" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 overflow-hidden">
                        {activity.authorProfileImage ? (
                          <img src={activity.authorProfileImage} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-500 text-sm font-semibold">{activity.authorName?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.authorName} <span className="font-normal text-gray-600">posted an update</span></p>
                        <p className="text-sm text-gray-700 mt-1 line-clamp-2">{activity.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )) : (
                     <div className="text-sm text-gray-500">No recent activity found.</div>
                  )}
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
