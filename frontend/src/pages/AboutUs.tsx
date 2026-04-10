
import { motion } from 'framer-motion'
import { 
  Code, 
  Heart, 
  Users, 
  Github, 
  Linkedin, 
  Mail,
  Coffee,
  Lightbulb,
  Rocket,
  Star,
  ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom';
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Development Team Data
const teamMembers = [
  {
    id: 1,
    name: "Ashwin Soni",
    role: "Lead Developer & Project Architect",
    image: "/team/ashwin.jpg",
    bio: "Full-stack developer with expertise in React, Node.js, and system architecture. Passionate about creating scalable solutions.",
    skills: ["React", "Node.js", "MongoDB", "System Design"],
    github: "#",
    linkedin: "#",
    email: "ashwin@gradsync.com",
    quote: "Building connections through code"
  },
  {
    id: 2,
    name: "Ajitesh Tripathi",
    role: "Frontend Specialist & UI/UX Designer",
    image: "/team/ajitesh.jpg",
    bio: "Creative developer focused on user experience and modern frontend technologies. Brings designs to life with pixel-perfect precision.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "#",
    linkedin: "#",
    email: "ajitesh@gradsync.com",
    quote: "Crafting beautiful user experiences"
  },
  {
    id: 3,
    name: "Abhishek Gupta",
    role: "Backend Engineer & Database Architect",
    image: "/team/abhishek.jpg",
    bio: "Backend specialist with deep knowledge of databases, APIs, and server architecture. Ensures robust and secure systems.",
    skills: ["Java", "Spring Boot", "MySQL", "MongoDB"],
    github: "#",
    linkedin: "#",
    email: "abhishek@gradsync.com",
    quote: "Building the backbone of innovation"
  },
  {
    id: 4,
    name: "Zainab Ansari",
    role: "Quality Assurance & Product Manager",
    image: "/team/zainab.jpg",
    bio: "Ensures product quality and manages development workflows. Bridges the gap between technical implementation and user needs.",
    skills: ["Testing", "Product Management", "Agile", "Documentation"],
    github: "#",
    linkedin: "#",
    email: "zainab@gradsync.com",
    quote: "Quality is not an act, it's a habit"
  }
]

// Project Stats
const projectStats = [
  { number: "6", label: "Months Development", icon: Coffee },
  { number: "1000+", label: "Lines of Code", icon: Code },
  { number: "46", label: "Alumni Profiles", icon: Users },
  { number: "100%", label: "Passion", icon: Heart }
]

// Technologies Used
const technologies = [
  { name: "React", color: "bg-blue-500" },
  { name: "Next.js", color: "bg-black" },
  { name: "TypeScript", color: "bg-blue-600" },
  { name: "Tailwind CSS", color: "bg-cyan-500" },
  { name: "Framer Motion", color: "bg-pink-500" },
  { name: "Spring Boot", color: "bg-green-600" },
  { name: "MongoDB", color: "bg-green-500" },
  { name: "MySQL", color: "bg-orange-500" }
]

export default function AboutUs() {
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
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 pt-24 pb-64 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-golden-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-golden-400/5 rounded-full blur-xl animate-pulse delay-700"></div>
          
          {/* Code-themed floating elements */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-golden-400/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping delay-1000"></div>
        </div>
        
        <div className="container-custom relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            {/* Back to Home */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-start mb-8"
            >
              <Link 
                to="/"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors group"
              >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
            >
              <Code className="w-5 h-5 text-golden-400" />
              <span className="text-sm font-medium">Meet the Developers</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              About <span className="text-golden-400">Us</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              We are four passionate developers who came together to create GradSync - 
              a platform that bridges the gap between PIEMR alumni and creates lasting connections.
            </motion.p>
            
            {/* Project Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
            >
              {projectStats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center w-12 h-12 bg-golden-400 rounded-lg mb-4 mx-auto">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{stat.number}</h3>
                  <p className="text-white/80 text-sm">{stat.label}</p>
                </div>
              ))}
            </motion.div>
            
            {/* Mission Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/20 relative z-10 mb-16 lg:mb-24"
            >
              <Lightbulb className="w-8 h-8 text-golden-400 mx-auto mb-4" />
              <p className="text-lg text-white/90 italic leading-relaxed">
                "Our mission is to create a seamless, beautiful, and powerful platform that helps 
                PIEMR alumni stay connected, share opportunities, and build meaningful professional 
                relationships that last a lifetime."
              </p>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249 250 251)"/>
          </svg>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Meet Our <span className="text-gradient">Dream Team</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Four passionate developers united by a common vision to revolutionize 
              alumni networking through innovative technology and exceptional design.
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
                className="group relative"
              >
                {/* Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-golden-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">

                    {/* Profile Image */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-primary-100 group-hover:ring-primary-300 transition-all duration-300">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback to a gradient avatar if image fails to load
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const nextElement = target.nextElementSibling as HTMLElement;
                            if (nextElement) nextElement.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="w-full h-full bg-gradient-to-br from-primary-500 to-golden-500 hidden items-center justify-center text-white text-xl font-bold"
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      
                      {/* Role Badge */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          <Star className="w-3 h-3 inline mr-1" />
                          Developer
                        </div>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-primary-600 font-semibold mb-2">{member.role}</p>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{member.bio}</p>
                      
                      {/* Quote */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4 group-hover:bg-primary-50 transition-colors">
                        <p className="text-xs italic text-gray-700 group-hover:text-primary-700 transition-colors">
                          "{member.quote}"
                        </p>
                      </div>
                    </div>
                    
                    {/* Skills */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {member.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex justify-center space-x-3">
                      <a
                        href={member.github}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-110"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a
                        href={member.linkedin}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-200 rounded-2xl transition-all duration-300"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Stack */}
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
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Built with <span className="text-gradient">Modern Technology</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              We used cutting-edge technologies to ensure GradSync is fast, secure, and scalable
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
          >
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <div className={`${tech.color} text-white px-6 py-3 rounded-full font-semibold text-sm transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                  {tech.name}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-gradient">Story</span>
              </h2>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-primary-50 to-golden-50 rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-40 h-40 bg-primary-600 rounded-full -translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-golden-500 rounded-full translate-x-30 translate-y-30"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-golden-500 rounded-full flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
                  <p className="text-xl mb-6">
                    GradSync was born from a simple observation: <strong>PIEMR alumni needed a better way to stay connected</strong>. 
                    As students ourselves, we saw the incredible talent and potential within our college community, 
                    but noticed that once graduation happened, these valuable connections often faded away.
                  </p>
                  
                  <p className="text-lg mb-6">
                    We decided to change that. Combining our diverse skills in <strong>frontend development</strong>, 
                    <strong>backend architecture</strong>, <strong>UI/UX design</strong>, and <strong>quality assurance</strong>, 
                    we set out to create something special - a platform that would not just connect alumni, 
                    but help them thrive together.
                  </p>
                  
                  <p className="text-lg mb-6">
                    After <strong>6 months of intensive development</strong>, countless late-night coding sessions, 
                    and an unwavering commitment to excellence, GradSync was born. Today, it serves as a bridge 
                    between past, present, and future PIEMR students, fostering relationships that extend far 
                    beyond graduation.
                  </p>
                  
                  <div className="text-center mt-8">
                    <p className="text-xl font-semibold text-primary-600 italic">
                      "Built by students, for students - connecting dreams with opportunities."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Want to Connect with Us?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
            >
              We'd love to hear from you! Whether you have feedback, suggestions, or just want to say hello.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="mailto:team@gradsync.com"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 group transition-all duration-200"
              >
                <Mail size={20} />
                <span>Email Us</span>
              </a>
              <Link
                to="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold transition-all duration-200"
              >
                Contact Form
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
