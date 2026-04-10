
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate as useRouter } from 'react-router-dom';
import { GraduationCap, Users, Calendar, TrendingUp, Award, Building } from 'lucide-react'
import { statsAPI } from '@/lib/api'

interface BatchData {
  year: number
  graduationYear: number
  totalStudents: number
  placedStudents: number
  averagePackage: string
  topCompanies: string[]
  isActive: boolean
  achievements?: string[]
}

interface BatchesSectionProps {
  showAll?: boolean
  maxBatches?: number
}

const BatchesSection = ({ showAll = false, maxBatches = 6 }: BatchesSectionProps) => {
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null)
  const [batches, setBatches] = useState<BatchData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch real batch data
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data: any = await statsAPI.getBatches()
        if (data.batches) {
            setBatches(data.batches)
        }
      } catch (error) {
        console.error('Error fetching batch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBatches()
  }, [])

  const displayBatches = showAll ? batches : batches.slice(0, maxBatches)
  const totalAlumni = batches.filter(b => b.graduationYear <= new Date().getFullYear()).reduce((sum, b) => sum + b.totalStudents, 0)

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">PIEMR Batches</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {showAll 
              ? "Celebrating 17 years of excellence • From our first batch in 2012 to the current batch of 2029"
              : "Explore our recent batches and their achievements • Connect with alumni across different years"
            }
          </p>
          <div className="mt-6 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>College Founded: 2008</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{totalAlumni.toLocaleString()}+ Alumni</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span>18 Batches</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                <p className="text-2xl font-bold text-blue-600">{totalAlumni.toLocaleString()}+</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Graduated Batches</p>
                <p className="text-2xl font-bold text-green-600">{batches.filter(b => b.graduationYear <= new Date().getFullYear()).length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Batches</p>
                <p className="text-2xl font-bold text-orange-600">{batches.filter(b => b.isActive).length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Placement</p>
                <p className="text-2xl font-bold text-purple-600">85%+</p>
              </div>
              <Building className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </motion.div>



        {/* Batches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!showAll && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 lg:col-span-3 text-center mb-4"
            >
              <p className="text-gray-600">
                Showing {displayBatches.length} of {batches.length} batches • 
                <a href="/batches" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                  View all {batches.length} batches →
                </a>
              </p>
            </motion.div>
          )}
        </div>
        
        {/* Batches Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-64"></div>
              </div>
            ))
          ) : (
            displayBatches.map((batch, index) => (
            <motion.div
              key={batch.graduationYear}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                batch.isActive 
                  ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' 
                  : batch.graduationYear <= new Date().getFullYear()
                  ? 'border-gray-200 hover:border-blue-300'
                  : 'border-gray-100 bg-gray-50'
              }`}
              onClick={() => setSelectedBatch(selectedBatch === batch.graduationYear ? null : batch.graduationYear)}
            >
              {/* Batch Status Badge */}
              <div className="absolute top-4 right-4">
                {batch.isActive ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Active
                  </span>
                ) : batch.graduationYear <= new Date().getFullYear() ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Graduated
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    Upcoming
                  </span>
                )}
              </div>

              <div className="p-6">
                {/* Batch Year */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Batch {batch.graduationYear}</h3>
                  <p className="text-sm text-gray-600">
                    {batch.year} - {batch.graduationYear} • {batch.graduationYear - batch.year} Years
                  </p>
                </div>

                {/* Key Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Students</span>
                    <span className="font-semibold text-gray-900">{batch.totalStudents}</span>
                  </div>
                  
                  {batch.graduationYear <= new Date().getFullYear() && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Placed</span>
                        <span className="font-semibold text-green-600">{batch.placedStudents}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg Package</span>
                        <span className="font-semibold text-blue-600">{batch.averagePackage} LPA</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Placement Rate Bar */}
                {batch.graduationYear <= new Date().getFullYear() && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Placement Rate</span>
                      <span className="text-xs font-medium text-gray-900">
                        {Math.round((batch.placedStudents / batch.totalStudents) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(batch.placedStudents / batch.totalStudents) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Top Companies */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Top Recruiters</p>
                  <div className="flex flex-wrap gap-1">
                    {batch.topCompanies.slice(0, 3).map((company) => (
                      <span 
                        key={company}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {company}
                      </span>
                    ))}
                    {batch.topCompanies.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
                        +{batch.topCompanies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Achievements */}
                {batch.achievements && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs font-medium text-gray-700">
                        {batch.achievements[0]}
                      </span>
                    </div>
                  </div>
                )}

                {/* Expand Indicator */}
                <div className="mt-4 text-center">
                  <span className="text-xs text-blue-600 hover:text-blue-800">
                    {selectedBatch === batch.graduationYear ? 'Click to collapse' : 'Click for details'}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedBatch === batch.graduationYear && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 p-6 bg-gray-50"
                >
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">All Recruiters</h4>
                      <div className="flex flex-wrap gap-2">
                        {batch.topCompanies.map((company) => (
                          <span 
                            key={company}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {batch.achievements && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Achievements</h4>
                        <ul className="space-y-1">
                          {batch.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600">
                              <Award className="h-3 w-3 text-yellow-500 mr-2" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t border-gray-200">
                      <button 
                        onClick={() => router(`/directory?batch=${batch.graduationYear}&branch=${batch.year === 2018 ? 'CSE' : 'All'}`)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Batch Directory
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {showAll ? "Join the PIEMR Alumni Network" : "Explore All PIEMR Batches"}
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {showAll 
                ? "Connect with alumni from all batches, share experiences, and build lasting professional relationships"
                : "Discover detailed information about all 15 batches, placement records, and connect with alumni from your year"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {showAll ? (
                <>
                  <button 
                    onClick={() => router('/directory')}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Browse Alumni Directory
                  </button>
                  <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                    Register as Alumni
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => router('/batches')}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    View All Batches
                  </button>
                  <button 
                    onClick={() => router('/directory')}
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    Alumni Directory
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BatchesSection
