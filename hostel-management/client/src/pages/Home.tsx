import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <section className="mb-5">
          <div className="row">
            <div className="col-md-8">
              <h2>Welcome to the Hostel Management System</h2>
              <p className="lead">
                Our system provides comprehensive management for 9 boys' hostels and 4 girls' hostels,
                keeping students informed about mess menus, announcements, and more.
              </p>
              <p>
                Wardens can manage their respective hostels, while the Chief Warden has oversight of all hostels.
              </p>
            </div>
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body">
                  <h5 className="card-title">Hostel Information</h5>
                  <p className="card-text">View current mess menus, announcements, and other hostel information without logging in.</p>
                  <a href="#hostels" className="btn btn-primary">View Hostels</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="row mb-5" id="hostels">
          <h3 className="mb-4">Our Hostels</h3>
          
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                Boys' Hostels
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Hostel 1</li>
                  <li className="list-group-item">Hostel 2</li>
                  <li className="list-group-item">Hostel 3</li>
                  <li className="list-group-item">Hostel 4</li>
                  <li className="list-group-item">Hostel 5</li>
                  <li className="list-group-item">Hostel 6</li>
                  <li className="list-group-item">Hostel 7</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-danger text-white">
                Girls' Hostels
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Mega Girls Hostel A</li>
                  <li className="list-group-item">Mega Girls Hostel B</li>
                  <li className="list-group-item">MHB-A</li>
                  <li className="list-group-item">MHB-B</li>
                  <li className="list-group-item">MHB-F</li>
                  <li className="list-group-item">MHG</li>
                  <li className="list-group-item">OHW-G1</li>
                  <li className="list-group-item">OHW-G2</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="mb-4">Features</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Mess Menu</h5>
                  <p className="card-text">View weekly mess menus for all hostels</p>
                  <a href="#mess-menu" className="btn btn-outline-primary">View Menus</a>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Announcements</h5>
                  <p className="card-text">Stay updated with important hostel announcements</p>
                  <a href="#announcements" className="btn btn-outline-primary">View Announcements</a>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Staff Information</h5>
                  <p className="card-text">Information about hostel wardens and staff</p>
                  <a href="#staff" className="btn btn-outline-primary">View Staff</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-light p-4 text-center mt-5">
          <p className="mb-0">For wardens and administrators: <Link to="/login">Login</Link> to manage hostel information</p>
        </footer>
      </div>
    </>
  );
};

export default Home; 