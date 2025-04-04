import React, { useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SliderManagement from './SliderManagement';

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
                <Link className="nav-link active" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/mess-menu">
                  Mess Menu
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/announcements">
                  Announcements
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/staff">
                  Staff Management
                </Link>
              </li>
              {userInfo.role === 'chiefWarden' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard/hostels">
                      Hostel Management
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard/slider">
                      Slider Images
                    </Link>
                  </li>
                </>
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

          <Routes>
            <Route path="/" element={<DashboardHome userInfo={userInfo} />} />
            <Route path="/slider" element={userInfo.role === 'chiefWarden' ? <SliderManagement /> : <Navigate to="/dashboard" replace />} />
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

interface DashboardHomeProps {
  userInfo: {
    _id: string;
    name: string;
    email: string;
    role: 'chiefWarden' | 'warden';
    hostelId?: string;
    token: string;
  };
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ userInfo }) => {
  return (
    <div className="row mt-4">
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Mess Menu</h5>
            <p className="card-text">Manage the hostel mess menu for the month</p>
            <Link to="/dashboard/mess-menu" className="btn btn-outline-primary">Update Menu</Link>
          </div>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Announcements</h5>
            <p className="card-text">Post and manage announcements for students</p>
            <Link to="/dashboard/announcements" className="btn btn-outline-primary">View Announcements</Link>
          </div>
        </div>
      </div>
      
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Staff Management</h5>
            <p className="card-text">Manage hostel staff details and assignments</p>
            <Link to="/dashboard/staff" className="btn btn-outline-primary">Manage Staff</Link>
          </div>
        </div>
      </div>

      {userInfo.role === 'chiefWarden' && (
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Slider Management</h5>
              <p className="card-text">Manage homepage slider images</p>
              <Link to="/dashboard/slider" className="btn btn-outline-primary">Manage Slider</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 