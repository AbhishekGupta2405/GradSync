
import { motion } from 'framer-motion'
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  CheckCircle,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Instagram
} from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    role: "President, Alumni Association",
    batch: "Batch 1995",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Leading the alumni network with 25+ years of industry experience in healthcare technology.",
    company: "Apollo Hospitals",
    linkedin: "#"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Vice President",
    batch: "Batch 2005",
    image: "https://images.unsplash.com/photo-1494790108755-2616b812c8db?w=300&h=300&fit=crop&crop=face",
    bio: "Passionate about connecting alumni and fostering professional growth across the network.",
    company: "Microsoft India",
    linkedin: "#"
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Secretary",
    batch: "Batch 2010",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    bio: "Coordinating events and maintaining alumni engagement across different batches.",
    company: "Wipro Technologies",
    linkedin: "#"
  },
  {
    id: 4,
    name: "Sneha Gupta",
    role: "Events Coordinator",
    batch: "Batch 2015",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    bio: "Creating memorable experiences and organizing impactful alumni events.",
    company: "Deloitte Consulting",
    linkedin: "#"
  }
]

// Mock testimonials
const testimonials = [
  {
    id: 1,
    content: "GradSync has been instrumental in reconnecting me with my batchmates and opening new career opportunities. The platform is intuitive and the community is incredibly supportive.",
    author: "Vikram Singh",
    batch: "Batch 2008",
    position: "Senior Manager, TCS",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face"
  },
  {
    id: 2,
    content: "The mentorship program through GradSync helped me transition into the tech industry. The guidance from senior alumni was invaluable for my career growth.",
    author: "Anita Desai",
    batch: "Batch 2018",
    position: "Software Engineer, Google",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=face"
  },
  {
    id: 3,
    content: "Being part of GradSync has allowed me to give back to the community while staying connected with the latest trends in my field. It's a win-win platform.",
    author: "Rohit Mehta",
    batch: "Batch 2000",
    position: "Director, Infosys",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
  }
]

// Statistics
const stats = [
  { number: "5000+", label: "Active Alumni", icon: Users },
  { number: "50+", label: "Countries", icon: MapPin },
  { number: "1000+", label: "Success Stories", icon: Award },
  { number: "200+", label: "Events Hosted", icon: Star }
]

// Values
const values = [
  {
    icon: Heart,
    title: "Community First",
    description: "We believe in the power of community and the strength that comes from supporting each other."
  },
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for excellence in everything we do, maintaining the highest standards of quality."
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We foster collaboration and knowledge sharing to help everyone succeed together."
  },
  {
    icon: Award,
    title: "Growth",
    description: "We are committed to continuous learning and growth for our entire alumni community."
  }
]

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
            >
              <Heart className="w-5 h-5 text-golden-400" />
              <span className="text-sm font-medium">PIEMR Alumni Network</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              About <span className="text-golden-400">GradSync</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Connecting PIEMR alumni worldwide through a comprehensive platform for networking, 
              career growth, and lifelong relationships that shape the future of healthcare and technology.
            </motion.p>
            
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-golden-400 rounded-lg mb-4 mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-2">5000+</h3>
                <p className="text-white/80 text-sm">Active Alumni</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-golden-400 rounded-lg mb-4 mx-auto">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-2">50+</h3>
                <p className="text-white/80 text-sm">Countries</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-golden-400 rounded-lg mb-4 mx-auto">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-2">1000+</h3>
                <p className="text-white/80 text-sm">Success Stories</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-golden-400 rounded-lg mb-4 mx-auto">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-2">25+</h3>
                <p className="text-white/80 text-sm">Years Legacy</p>
              </div>
            </motion.div>
            
            {/* Mission Statement Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/20"
            >
              <Quote className="w-8 h-8 text-golden-400 mx-auto mb-4" />
              <p className="text-lg text-white/90 italic leading-relaxed">
                "Fostering lifelong connections among PIEMR alumni, providing a platform for 
                professional growth, mentorship, and community engagement that strengthens our 
                collective success and commitment to supporting each other throughout our careers."
              </p>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-golden-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-golden-400/5 rounded-full blur-xl animate-pulse delay-700"></div>
        
        {/* Medical/Tech themed floating elements */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-golden-400/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping delay-1000"></div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249 250 251)"/>
          </svg>
        </div>
      </section>

      {/* Vision & Values Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <motion.div 
              variants={itemVariants}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Vision & Values
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Building a stronger tomorrow through meaningful connections, continuous learning, 
                and unwavering support for our alumni community.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              <div className="bg-primary-50 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To be the premier global network of PIEMR alumni, empowering members to achieve 
                  their professional and personal goals while contributing to society and healthcare advancement.
                </p>
              </div>
              
              <div className="bg-golden-50 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-golden-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Purpose</h3>
                <p className="text-gray-600 leading-relaxed">
                  To create meaningful connections, facilitate knowledge sharing, and provide 
                  opportunities for professional development within our diverse alumni community.
                </p>
              </div>
              
              <div className="bg-green-50 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
                <p className="text-gray-600 leading-relaxed">
                  Excellence, integrity, collaboration, and innovation guide everything we do 
                  as we build lasting relationships and drive positive impact in healthcare.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Our Impact
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600"
            >
              Numbers that reflect our growing community and success
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center bg-white p-6 rounded-xl shadow-sm"
              >
                <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Our Values
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600"
            >
              The principles that guide everything we do
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors group"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Leadership Team
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600"
            >
              Meet the dedicated alumni who lead our community
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-1">{member.role}</p>
                <p className="text-sm text-gray-500 mb-2">{member.batch}</p>
                <p className="text-sm text-gray-600 mb-3">{member.company}</p>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{member.bio}</p>
                <a
                  href={member.linkedin}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <Linkedin className="w-4 h-4 mr-1" />
                  Connect
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              What Alumni Say
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600"
            >
              Hear from our community members about their GradSync experience
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                className="bg-gray-50 rounded-xl p-6 relative"
              >
                <Quote className="w-8 h-8 text-primary-300 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.batch}</p>
                    <p className="text-sm text-primary-600">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              variants={itemVariants}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600">
                Have questions or suggestions? We'd love to hear from you
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="text-gray-700">alumni@piemr.edu</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="text-gray-700">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-primary-600 mr-3" />
                    <span className="text-gray-700">PIEMR Campus, Bangalore, India</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">
                      <Linkedin className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">
                      <Twitter className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">
                      <Instagram className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full btn-primary">
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}