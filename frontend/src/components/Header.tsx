import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, User, LogIn, LogOut, Settings } from 'lucide-react'
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'
import { messageAPI } from '@/lib/api'
import piemrLogo from '@/assets/piemr-logo.png'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  // Poll for unread messages
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    
    const fetchUnread = async () => {
      try {
        const data: any = await messageAPI.getUnreadCount(user.id);
        setUnreadCount(data?.unreadCount || 0);
      } catch { /* silent */ }
    };
    
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id])

  const basePath = isAuthenticated && user?.role ? `/${user.role.toLowerCase()}` : '/auth/login'

  const navItems = isAuthenticated ? [
    { name: 'Dashboard', href: `${basePath}/dashboard` },
    { name: 'Directory', href: `${basePath}/directory` },
    { name: 'Messages', href: `${basePath}/messages` },
    { name: 'Feed', href: `${basePath}/feed` },
    { name: 'Batches', href: '/batches' },
    { name: 'Jobs', href: `${basePath}/jobs` },
    { name: 'Events', href: `${basePath}/events` }
  ] : [
    { name: 'Home', href: '/' },
    { name: 'Batches', href: '/batches' },
    { name: 'About', href: '/about' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-3">
              {/* PIEMR Logo with subtle border */}
              <div className="flex items-center justify-center p-1 bg-white rounded-lg shadow-sm border border-gray-100">
                <img 
                  src={piemrLogo} 
                  alt="PIEMR Logo" 
                  className="h-9 w-9 object-contain"
                />
              </div>
              
              {/* Clean Brand Text */}
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-blue-800 tracking-tight">GradSync</span>
                <div className="text-xs text-gray-500 font-medium tracking-wide -mt-0.5">
                  Alumni Network
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-6 xl:space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={item.href} className="nav-link whitespace-nowrap relative">
                  {item.name}
                  {item.name === 'Messages' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1e40af&color=fff`}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.role}
                    </div>
                  </div>
                </motion.button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                  >
                    <Link
                      to={`${basePath}/dashboard`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} className="mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      to={`${basePath}/profile`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} className="mr-3" />
                      Profile Settings
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                         logout()
                         setShowUserMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link to="/auth/login" className="btn-ghost flex items-center space-x-2 whitespace-nowrap">
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/auth/register" className="btn-primary flex items-center space-x-2 whitespace-nowrap">
                    <User size={18} />
                    <span>Join Network</span>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 py-4"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="nav-link block px-2 py-1 relative"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                  {item.name === 'Messages' && unreadCount > 0 && (
                    <span className="inline-block ml-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  )}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                  <Link to="/auth/login" onClick={() => setIsMenuOpen(false)} className="btn-ghost w-full flex items-center justify-center">
                    <LogIn size={18} className="mr-2" />
                    Sign In
                  </Link>
                  <Link to="/auth/register" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full flex items-center justify-center">
                    <User size={18} className="mr-2" />
                    Join Network
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
