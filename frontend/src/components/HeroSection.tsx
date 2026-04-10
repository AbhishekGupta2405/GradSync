
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Users, Briefcase, TrendingUp } from 'lucide-react'

export default function HeroSection() {
  const navigate = useNavigate()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <section id="home" className="min-h-screen gradient-hero flex items-center pt-16">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Connect. Grow.{' '}
                <span className="text-gradient">Succeed.</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Join the PIEMR alumni network where graduates connect, 
                share opportunities, and build lasting professional relationships.
              </p>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500">2000+</div>
                <div className="text-sm text-gray-600">Alumni Connected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden-500">500+</div>
                <div className="text-sm text-gray-600">Job Referrals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">95%</div>
                <div className="text-sm text-gray-600">Placement Rate</div>
              </div>
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button onClick={() => navigate('/auth/register')} className="btn-primary flex items-center justify-center space-x-2 group">
                <span>Join Network</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/directory')} className="btn-secondary">
                Explore Alumni
              </button>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Visual Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100"
              >
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-golden-500 rounded-full flex items-center justify-center">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Alumni Network</h3>
                      <p className="text-gray-600 text-sm">Connect with 2000+ graduates</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-sm">Priya Sharma</div>
                          <div className="text-xs text-gray-600">Google • SDE</div>
                        </div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Batch 2020
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-golden-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-sm">Rahul Patel</div>
                          <div className="text-xs text-gray-600">Microsoft • PM</div>
                        </div>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Batch 2019
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -top-4 -right-4 bg-golden-500 text-white p-4 rounded-xl shadow-lg"
              >
                <Briefcase size={24} />
                <div className="text-xs mt-1">500+ Jobs</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -bottom-4 -left-4 bg-primary-500 text-white p-4 rounded-xl shadow-lg"
              >
                <TrendingUp size={24} />
                <div className="text-xs mt-1">95% Success</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
