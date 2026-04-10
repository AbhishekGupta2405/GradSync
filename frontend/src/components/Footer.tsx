
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom';
import piemrLogo from '@/assets/piemr-logo.png'

export default function Footer() {
  const quickLinks = [
    { name: 'About Us', href: '/about-us' },
    { name: 'Alumni Directory', href: '/directory' },
    { name: 'Job Portal', href: '/jobs' },
    { name: 'Events', href: '/events' },
    { name: 'Success Stories', href: '#stories' },
    { name: 'Contact', href: '#contact' },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 lg:col-span-2"
            >
              <div className="flex items-center space-x-4">
                {/* PIEMR Logo with subtle glow */}
                <div className="flex items-center justify-center p-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                  <img 
                    src={piemrLogo} 
                    alt="PIEMR Logo" 
                    className="h-10 w-10 object-contain opacity-90"
                  />
                </div>
                
                {/* Clean Brand Text */}
                <div className="flex flex-col leading-tight">
                  <span className="text-2xl font-bold text-white tracking-tight">GradSync</span>
                  <div className="text-xs text-gray-400 font-medium tracking-wide -mt-0.5">
                    Alumni Network Platform
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 leading-relaxed">
                Connecting PIEMR graduates worldwide. Building bridges between past, present, and future generations of engineers.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail size={18} />
                  <span>contact@gradsync.piemr.edu</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone size={18} />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin size={18} />
                  <span>PIEMR Campus, Indore, MP</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>



            {/* Newsletter & Social */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold">Stay Connected</h3>
              
              {/* Newsletter Signup */}
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">
                  Get the latest updates and opportunities
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-primary-500 text-white"
                  />
                  <button className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-r-lg transition-colors duration-200">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-gray-400 text-sm mb-3">Follow us</p>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors duration-200 group"
                    >
                      <social.icon size={18} className="text-gray-400 group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 GradSync - PIEMR Alumni Network. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
