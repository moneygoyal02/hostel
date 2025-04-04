import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Hostel Management System</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#hostels">Hostels</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#announcements">Announcements</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#mess-menu">Mess Menu</a>
            </li>
          </ul>
          <div className="d-flex">
            {userInfo ? (
              <>
                <Link to="/dashboard" className="btn btn-outline-light me-2">Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-light">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
                <Link to="/signup" className="btn btn-light">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 