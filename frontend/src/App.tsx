import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import Home from './pages/Home';
import About from './pages/About';
import AboutUs from './pages/AboutUs';
import Batches from './pages/Batches';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import Events from './pages/Events';
import Feed from './pages/Feed';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Messages from './pages/Messages';
import AdminLogin from './pages/AdminLogin';
import LinkedInCallback from './pages/LinkedInCallback';
import PendingVerification from './pages/PendingVerification';
import ScrollToTop from './components/ScrollToTop';
import RoleGuard from './components/RoleGuard';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Top-Level Generic Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
          <Route path="/pending-verification" element={<PendingVerification />} />
          <Route path="/user/:userId" element={<PublicProfile />} />

          {/* Legacy Fallback Bounce Guards */}
          {/* To make sure if anyone bookmarks the old urls, it safely lands them */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/feed" element={<Navigate to="/" replace />} />
          
          {/* Strict Compartmentalized Dynamic Role Routes */}
          <Route path="/:role/dashboard" element={<RoleGuard><Dashboard /></RoleGuard>} />
          <Route path="/:role/directory" element={<RoleGuard><Directory /></RoleGuard>} />
          <Route path="/:role/events" element={<RoleGuard><Events /></RoleGuard>} />
          <Route path="/:role/feed" element={<RoleGuard><Feed /></RoleGuard>} />
          <Route path="/:role/jobs" element={<RoleGuard><Jobs /></RoleGuard>} />
          <Route path="/:role/profile" element={<RoleGuard><Profile /></RoleGuard>} />
          <Route path="/:role/messages" element={<RoleGuard><Messages /></RoleGuard>} />
          
          {/* Catch All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
