
import { motion } from 'framer-motion'
import { ArrowRight, Users, Zap, Shield } from 'lucide-react'

export default function CTASection() {
  const benefits = [
    {
      icon: Users,
      title: 'Instant Access',
      description: 'Connect with 2000+ alumni immediately',
    },
    {
      icon: Zap,
      title: 'Fast Networking',
      description: 'Find relevant connections in seconds',
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'All alumni profiles are verified',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="gradient-primary rounded-3xl p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-golden-500 rounded-full translate-x-30 translate-y-30"></div>
          </div>

          <div className="relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-bold mb-4">
                    Ready to Unlock Your Network?
                  </h2>
                  <p className="text-xl text-primary-100 leading-relaxed">
                    Join thousands of PIEMR graduates who are already building meaningful connections, 
                    finding opportunities, and advancing their careers together.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-primary-500 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 group transition-all duration-200"
                  >
                    <span>Join Network Now</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white hover:bg-white hover:text-primary-500 px-8 py-4 rounded-lg font-semibold transition-all duration-200"
                  >
                    Learn More
                  </motion.button>
                </div>

                <div className="text-primary-100 text-sm">
                  ✓ Free to join • ✓ Instant access • ✓ No spam, ever
                </div>
              </motion.div>

              {/* Right Column - Benefits */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4"
                  >
                    <div className="bg-white/20 rounded-lg p-2">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-primary-100 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
