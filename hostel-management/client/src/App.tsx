import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import HostelDetail from './pages/HostelDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import WardenDashboard from './pages/WardenDashboard';
import './styles.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="container-full p-0 m-0 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/hostels/:hostelType/:hostelId" element={<HostelDetail />} />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute roles={['chiefWarden']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/warden-dashboard/*"
            element={
              <ProtectedRoute roles={['warden']}>
                <WardenDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App; 