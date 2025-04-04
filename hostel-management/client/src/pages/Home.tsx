// pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ImageSlider from '../components/ImageSlider';
import axios from 'axios';

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
    <div className="page-wrapper overflow-hidden">
      <Navbar />
      
      {/* Full width slider section */}
      <div className="slider-section">
        {loading ? (
          <div className="loading-container" style={{ marginTop: '50px', height: 'calc(90vh - 50px)' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="error-container" style={{ marginTop: '50px', height: 'calc(90vh - 50px)' }}>
            <p className="text-danger">{error}</p>
          </div>
        ) : (
          <div className="slider-wrapper w-full">
            <ImageSlider images={images} fullScreen={true} />
          </div>
        )}
      </div>
      
      <div className="content-wrapper bg-white">
        <div className="container py-5 mx-auto">
          <section className="row mt-3 mb-5" id="hostels">
            <h3 className="mb-4 text-center fw-bold">Our Hostels</h3>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-primary text-white">
                  Boys' Hostels
                </div>
                <div className="card-body">
                  <div className="row">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="col-6 mb-2">
                        <Link className="text-decoration-none" to={`/hostels/boys/${i + 1}`}>
                          Hostel {i + 1}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-danger text-white">
                  Girls' Hostels
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 mb-2">
                      <Link className="text-decoration-none" to="/hostels/girls/mgha">
                        Mega Girls Hostel A
                      </Link>
                    </div>
                    <div className="col-6 mb-2">
                      <Link className="text-decoration-none" to="/hostels/girls/mghb">
                        Mega Girls Hostel B
                      </Link>
                    </div>
                    <div className="col-6 mb-2">
                      <Link className="text-decoration-none" to="/hostels/girls/mhba">
                        MHB-A
                      </Link>
                    </div>
                    <div className="col-6 mb-2">
                      <Link className="text-decoration-none" to="/hostels/girls/mhbb">
                        MHB-B
                      </Link>
                    </div>
                    <div className="col-6 mb-2">
                      <Link className="text-decoration-none" to="/hostels/girls/mhbf">
                        MHB-F
                      </Link>
                    </div>
                    <div className="col-6 mb-2">
                      <Link className="text-decoration-none" to="/hostels/girls/mhg">
                        MHG
                      </Link>
                    </div>
                    <div className="col-6 mb-2">
                      <Link className="text-decoration-none" to="/hostels/girls/ohwg1">
                        OHW-G1
                      </Link>
                    </div>
                    <div className="col-6 mb-2">
                      <Link className="text-decoration-none" to="/hostels/girls/ohwg2">
                        OHW-G2
                      </Link>
                    </div>
                  </div>
                </div>
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
