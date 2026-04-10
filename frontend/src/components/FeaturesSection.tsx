
import { motion } from 'framer-motion'
import { Network, Briefcase, Users, Calendar, MessageCircle, Award } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Network,
      title: 'Professional Networking',
      description: 'Connect with alumni across industries, locations, and experience levels. Build meaningful professional relationships.',
      color: 'text-primary-500',
      bgColor: 'bg-primary-50',
    },
    {
      icon: Briefcase,
      title: 'Job Opportunities',
      description: 'Access exclusive job postings, referral programs, and career opportunities shared by fellow alumni.',
      color: 'text-golden-500',
      bgColor: 'bg-golden-50',
    },
    {
      icon: Users,
      title: 'Mentorship Program',
      description: 'Guide current students or connect with industry experts for career guidance and professional growth.',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Calendar,
      title: 'Events & Reunions',
      description: 'Stay updated with alumni events, reunions, webinars, and networking sessions happening worldwide.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: MessageCircle,
      title: 'Discussion Forums',
      description: 'Engage in meaningful discussions, share insights, and collaborate on projects with your batch mates.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Award,
      title: 'Success Stories',
      description: 'Celebrate achievements, share your journey, and inspire the next generation of PIEMR graduates.',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section id="network" className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Stay Connected
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools and features designed to help PIEMR alumni network, collaborate, and grow together
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card p-8 group hover:shadow-xl transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`${feature.color} w-7 h-7`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="gradient-primary rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Connect with Your Alumni Network?
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Join thousands of PIEMR graduates who are already building meaningful connections and advancing their careers together.
            </p>
            <button className="bg-white text-primary-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Get Started Today
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
