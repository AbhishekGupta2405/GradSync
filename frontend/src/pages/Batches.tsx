
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BatchesSection from '@/components/BatchesSection'
import FeaturedBatchCards from '@/components/FeaturedBatchCards'
import { GraduationCap, Calendar, Users, TrendingUp } from 'lucide-react'

export default function Batches() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-blue-300 mr-4" />
              <div>
                <h1 className="text-5xl font-bold mb-2">PIEMR Batches</h1>
                <p className="text-xl text-blue-200">2012 - 2026 • 15 Years of Excellence</p>
              </div>
            </div>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Explore the journey of PIEMR from our first graduating batch in 2012 to the current batch of 2026. 
              Discover placement records, achievements, and connect with alumni across all years.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <Calendar className="h-8 w-8 text-blue-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">2008</div>
                <div className="text-sm text-blue-200">College Founded</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <GraduationCap className="h-8 w-8 text-green-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">2012</div>
                <div className="text-sm text-blue-200">First Batch</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <Users className="h-8 w-8 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">3000+</div>
                <div className="text-sm text-blue-200">Total Alumni</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <TrendingUp className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">85%+</div>
                <div className="text-sm text-blue-200">Avg Placement</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Batch Cards */}
      <FeaturedBatchCards />

      {/* Batches Section */}
      <BatchesSection showAll={true} />

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">PIEMR Journey Timeline</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our institution's growth and development
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {[
                { year: 2008, title: "PIEMR Established", description: "College founded with a vision to provide quality engineering education" },
                { year: 2012, title: "First Graduation", description: "Our inaugural batch of engineers graduated and entered the industry" },
                { year: 2015, title: "Industry Partnerships", description: "Established partnerships with leading tech companies for placements" },
                { year: 2018, title: "Research Excellence", description: "Achieved recognition for outstanding research contributions" },
                { year: 2020, title: "Digital Transformation", description: "Successfully adapted to online learning during pandemic" },
                { year: 2023, title: "Alumni Network Launch", description: "Launched GradSync platform to connect all alumni" },
                { year: 2024, title: "15 Years of Excellence", description: "Celebrating 15 years of quality education and industry partnerships" }
              ].map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
