import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleSwitcher from './components/RoleSwitcher';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Reviews from './pages/Reviews';
import Events from './pages/Events';
import Internships from './pages/Internships';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import UniversityProfile from './pages/UniversityProfile';
import SocietyProfile from './pages/SocietyProfile';
import SuperadminDashboard from './pages/SuperadminDashboard';
import UniAdminDashboard from './pages/UniAdminDashboard';
import SocietyDashboard from './pages/SocietyDashboard';
import StudentDashboard from './pages/StudentDashboard';

const DashboardRouter = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
  }

  switch(user.role) {
    case 'superAdmin': return <SuperadminDashboard />;
    case 'uniAdmin': return <UniAdminDashboard />;
    case 'societyAdmin': return <SocietyDashboard />;
    case 'student': return <StudentDashboard />;
    default: return <Navigate to="/login" />;
  }
};

function AppContent() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/events" element={<Events />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/university/:id" element={<UniversityProfile />} />
            <Route path="/society/:id" element={<SocietyProfile />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
          </Routes>
        </main>
        <Footer />
        <RoleSwitcher />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
