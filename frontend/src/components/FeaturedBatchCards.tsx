
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate as useRouter } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  Building, 
  DollarSign,
  ArrowRight
} from 'lucide-react'

interface BatchStats {
  graduationYear: number
  totalStudents: number
  placedStudents: number
  averagePackage: number
  placementPercentage: number
  topCompanies: string[]
  totalAlumni?: number
}

import { statsAPI } from '@/lib/api'

export default function FeaturedBatchCards() {
  const [batchStats, setBatchStats] = useState<BatchStats[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchBatchStats()
  }, [])

  const fetchBatchStats = async () => {
    try {
      const response: any = await statsAPI.getBatches()
      if (response && response.batches) {
        // Find top 3 batches that have placed students
        const topBatches = response.batches
          .filter((b: any) => b.placedStudents != null && b.placedStudents > 0)
          .sort((a: any, b: any) => b.graduationYear - a.graduationYear)
          .slice(0, 3)
          
        setBatchStats(topBatches)
      } else {
        setBatchStats([])
      }
    } catch (error) {
      console.error('Error fetching batch statistics:', error)
      setBatchStats([])
    } finally {
      setLoading(false)
    }
  }

  const getBatchColor = (year: number) => {
    switch (year) {
      case 2022: return 'blue'
      case 2023: return 'green'  
      case 2024: return 'purple'
      default: return 'gray'
    }
  }

  const getBatchDescription = (year: number) => {
    switch (year) {
      case 2022: return 'Pioneer batch with strong industry connections and proven track record'
      case 2023: return 'Service-focused batch with excellent placement in established companies'
      case 2024: return 'Product-oriented batch with premium packages and top-tier companies'
      default: return 'Dedicated professionals making their mark in the industry'
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Alumni Batches</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the success stories and achievements of our recent graduating batches
          </p>
        </motion.div>

        {/* Batch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {batchStats.map((batch, index) => {
            const color = getBatchColor(batch.graduationYear)
            return (
              <motion.div
                key={batch.graduationYear}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => router(`/directory?batch=${batch.graduationYear}`)}
              >
                {/* Gradient Header */}
                <div className={`h-32 bg-gradient-to-br ${
                  color === 'blue' ? 'from-blue-500 to-blue-600' :
                  color === 'green' ? 'from-green-500 to-green-600' :
                  color === 'purple' ? 'from-purple-500 to-purple-600' :
                  'from-gray-500 to-gray-600'
                } relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      Class of {batch.graduationYear}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-6">
                    <GraduationCap className="h-8 w-8 text-white/80" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Batch Title */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Batch {batch.graduationYear}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {getBatchDescription(batch.graduationYear)}
                    </p>
                  </div>

                  {/* Key Statistics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        color === 'blue' ? 'text-blue-600' :
                        color === 'green' ? 'text-green-600' :
                        color === 'purple' ? 'text-purple-600' :
                        'text-gray-600'
                      }`}>
                        {batch.totalStudents}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Alumni</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        color === 'blue' ? 'text-blue-600' :
                        color === 'green' ? 'text-green-600' :
                        color === 'purple' ? 'text-purple-600' :
                        'text-gray-600'
                      }`}>
                        {batch.placementPercentage.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Placed</div>
                    </div>
                  </div>

                  {/* Placement Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Placed Students</span>
                      </div>
                      <span className="font-semibold text-green-600">{batch.placedStudents}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Avg Package</span>
                      </div>
                      <span className="font-semibold text-blue-600">{batch.averagePackage.toFixed(1)} LPA</span>
                    </div>
                  </div>

                  {/* Placement Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Placement Progress</span>
                      <span className="text-xs font-medium text-gray-900">
                        {batch.placementPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                          'bg-gradient-to-r from-gray-400 to-gray-600'
                        }`}
                        style={{ width: `${batch.placementPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Top Companies */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Top Recruiters</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {batch.topCompanies.slice(0, 3).map((company) => (
                        <span 
                          key={company}
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                            color === 'blue' ? 'bg-blue-100 text-blue-800' :
                            color === 'green' ? 'bg-green-100 text-green-800' :
                            color === 'purple' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {company}
                        </span>
                      ))}
                      {batch.topCompanies.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                          +{batch.topCompanies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className={`flex items-center justify-between text-sm font-medium group-hover:${
                      color === 'blue' ? 'text-blue-600' :
                      color === 'green' ? 'text-green-600' :
                      color === 'purple' ? 'text-purple-600' :
                      'text-gray-600'
                    } transition-colors`}>
                      <span>View Alumni Directory</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Explore All Alumni Batches</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Connect with alumni from all graduating years, discover career paths, and build meaningful professional relationships
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router('/directory')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Browse All Alumni
              </button>
              <button 
                onClick={() => router('/batches')}
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View All Batches
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
