
import { motion } from 'framer-motion'
import { Users, Briefcase, GraduationCap, Building } from 'lucide-react'

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      number: '2000+',
      label: 'Active Alumni',
      description: 'Connected professionals worldwide',
      color: 'text-primary-500',
      bgColor: 'bg-primary-50',
    },
    {
      icon: Briefcase,
      number: '500+',
      label: 'Job Referrals',
      description: 'Successful placements this year',
      color: 'text-golden-500',
      bgColor: 'bg-golden-50',
    },
    {
      icon: Building,
      number: '200+',
      label: 'Top Companies',
      description: 'Where our alumni work',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: GraduationCap,
      number: '15+',
      label: 'Years Legacy',
      description: 'Of excellence and growth',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powering Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join a thriving community of PIEMR graduates making their mark across industries and continents
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card p-8 text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`${stat.color} w-8 h-8`} />
              </div>
              
              <div className="space-y-2">
                <div className={`text-4xl font-bold ${stat.color}`}>
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {stat.label}
                </div>
                <div className="text-gray-600">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-8 bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">95%</div>
              <div className="text-sm text-gray-600">Placement Rate</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-golden-500">₹12L</div>
              <div className="text-sm text-gray-600">Avg. Package</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">50+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
