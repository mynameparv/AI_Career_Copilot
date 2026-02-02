
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AICopilot from './pages/AICopilot';
import Projects from './pages/Projects';
import JobTracker from './pages/JobTracker';
import ResumeAssistant from './pages/ResumeAssistant';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Defined ProtectedLayout outside of the App component to ensure stable references and fix children type errors.
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-[#fcfcfc]">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <Navbar />
      <main className="p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('userInfo'));

  React.useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('userInfo'));
    };

    // Listen for storage events (logout/login in other tabs, though mainly for same-tab updates if we dispatch event)
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={isAuthenticated ? <ProtectedLayout><Dashboard /></ProtectedLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/copilot"
          element={isAuthenticated ? <ProtectedLayout><AICopilot /></ProtectedLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/projects"
          element={isAuthenticated ? <ProtectedLayout><Projects /></ProtectedLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/tracker"
          element={isAuthenticated ? <ProtectedLayout><JobTracker /></ProtectedLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/resume"
          element={isAuthenticated ? <ProtectedLayout><ResumeAssistant /></ProtectedLayout> : <Navigate to="/login" />}
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
