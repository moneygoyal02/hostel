// pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ImageSlider from '../components/ImageSlider';
import axios from 'axios';
import '../components/ImageSlider.css';

interface SliderImage {
  _id: string;
  url: string;
  caption?: string;
  order: number;
}

const Home: React.FC = () => {
  const [images, setImages] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get<SliderImage[]>('http://localhost:5000/api/slider-images');
        setImages(response.data);
      } catch (err: any) {
        console.error('Error fetching slider images:', err);
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar />
      
      {/* Full width slider section */}
      <div className="slider-section mb-4" style={{ marginTop: '56px' }}>
        {loading ? (
          <div className="loading-container d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="error-container d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <p className="text-danger">{error}</p>
          </div>
        ) : (
          <div className="slider-wrapper">
            <ImageSlider images={images} fullScreen={true} />
          </div>
        )}
      </div>
      
      <div className="content-wrapper bg-white">
        <div className="container py-3 mx-auto">
          <section className="row mt-3 mb-5" id="hostels">
            <div className="col-md-6 mb-4">
              <h2 className="mb-4 fw-bold text-center">We Have Ten Boys' Hostels</h2>
              <div className="hostel-list">
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/boys/1">
                    Boys Hostel 1
                  </Link>
                </p>
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/boys/2">
                    Boys Hostel 2
                  </Link>
                </p>
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/boys/3">
                    Boys Hostel 3
                  </Link>
                </p>
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/boys/4">
                    Boys Hostel 4
                  </Link>
                </p>
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/boys/6">
                    Boys Hostel 6
                  </Link>
                </p>
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/boys/7">
                    Boys Hostel 7
                  </Link>
                </p>
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/boys/mega-a">
                    Mega Boys Hostel: Block - A
                  </Link>
                </p>
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/boys/mega-b">
                    Mega Boys Hostel: Block - B
                  </Link>
                </p>
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/boys/mega-f">
                    Mega Boys Hostel: Block - F
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <h2 className="mb-4 fw-bold text-center">We Have Four Girls' Hostels</h2>
              <div className="hostel-list">
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/girls/1">
                    Girls Hostel 1
                  </Link>
                </p>
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/girls/2">
                    Girls Hostel 2
                  </Link>
                </p>
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/girls/mega1">
                    Mega Girls Hostel 1
                  </Link>
                </p>
                <p>
                  <span className="me-2">→</span>
                  <Link className="text-primary fw-medium" to="/hostels/girls/mega-phase2">
                    Mega Girls Hostel : Phase 2
                  </Link>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-5">
            <h3 className="mb-4 text-center fw-bold">Features</h3>
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Mess Menu</h5>
                    <p className="card-text">View weekly mess menus for all hostels</p>
                    <Link to="/mess-menu" className="btn btn-outline-primary">View Menus</Link>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Announcements</h5>
                    <p className="card-text">Stay updated with important hostel announcements</p>
                    <Link to="/announcements" className="btn btn-outline-primary">View Announcements</Link>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Staff Information</h5>
                    <p className="card-text">Information about hostel wardens and staff</p>
                    <Link to="/staff" className="btn btn-outline-primary">View Staff</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="bg-light p-4 text-center mt-5">
            <p className="mb-0">
              For wardens and administrators: <Link to="/login">Login</Link> to manage hostel information
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Home;
