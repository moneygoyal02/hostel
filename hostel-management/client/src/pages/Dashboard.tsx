import React, { useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse" style={{ minHeight: '100vh' }}>
          <div className="position-sticky pt-3">
            <div className="p-3 mb-4 text-center">
              <h5>{userInfo.name}</h5>
              <p className="text-muted">{userInfo.role === 'chiefWarden' ? 'Chief Warden' : 'Hostel Warden'}</p>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link active" href="#dashboard">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#mess-menu">
                  Mess Menu
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#announcements">
                  Announcements
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#staff">
                  Staff Management
                </a>
              </li>
              {userInfo.role === 'chiefWarden' && (
                <li className="nav-item">
                  <a className="nav-link" href="#hostels">
                    Hostel Management
                  </a>
                </li>
              )}
              <li className="nav-item mt-5">
                <button className="nav-link btn btn-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div>
              {userInfo.role === 'warden' ? (
                <span className="badge bg-primary">Warden Dashboard</span>
              ) : (
                <span className="badge bg-danger">Chief Warden Dashboard</span>
              )}
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Mess Menu</h5>
                  <p className="card-text">Manage the hostel mess menu for the month</p>
                  <a href="#mess-menu" className="btn btn-outline-primary">Update Menu</a>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Announcements</h5>
                  <p className="card-text">Post and manage announcements for students</p>
                  <a href="#announcements" className="btn btn-outline-primary">View Announcements</a>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Staff Management</h5>
                  <p className="card-text">Manage hostel staff details and assignments</p>
                  <a href="#staff" className="btn btn-outline-primary">Manage Staff</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 