import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Nav, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SliderManagement from '../components/warden/SliderManagement';
import StaffManagement from '../components/warden/StaffManagement';
import MessMenuManagement from '../components/warden/MessMenuManagement';
import GalleryManagement from '../components/warden/GalleryManagement';
import ProfileManagement from '../components/warden/ProfileManagement';
import { Hostel } from '../types';

const WardenDashboard: React.FC = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in and is a warden
    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (userInfo.role !== 'warden' && userInfo.role !== 'chiefWarden') {
      navigate('/dashboard');
      return;
    }

    // Fetch warden's hostel details
    const fetchHostelDetails = async () => {
      try {
        setLoading(true);
        
        // For wardens, fetch their specific hostel
        // For chief wardens, they would have a different view (not implemented here)
        const response = await axios.get(`http://localhost:5000/api/hostels/warden`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        });
        
        setHostel(response.data.hostel);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching hostel details:', err);
        setError(err.response?.data?.message || 'Failed to load hostel details');
      } finally {
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, [userInfo, navigate]);

  // Render the active tab content
  const renderTabContent = () => {
    if (!hostel) return null;

    switch (activeTab) {
      case 'profile':
        return <ProfileManagement hostel={hostel} />;
      case 'slider':
        return <SliderManagement hostelId={hostel._id} />;
      case 'staff':
        return <StaffManagement hostelId={hostel._id} />;
      case 'messMenu':
        return <MessMenuManagement hostelId={hostel._id} />;
      case 'gallery':
        return <GalleryManagement hostelId={hostel._id} />;
      default:
        return <ProfileManagement hostel={hostel} />;
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!hostel) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          No hostel assigned to this warden. Please contact the administrator.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={12} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-0">Warden Dashboard - {hostel.name}</h3>
              <p className="text-muted">Manage your hostel information and content</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={3} lg={2} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header>Manage Hostel</Card.Header>
            <Card.Body className="p-0">
              <Nav className="flex-column">
                <Nav.Link 
                  className={activeTab === 'profile' ? 'active bg-light' : ''} 
                  onClick={() => setActiveTab('profile')}
                >
                  Profile & Information
                </Nav.Link>
                <Nav.Link 
                  className={activeTab === 'slider' ? 'active bg-light' : ''} 
                  onClick={() => setActiveTab('slider')}
                >
                  Slider Images
                </Nav.Link>
                <Nav.Link 
                  className={activeTab === 'staff' ? 'active bg-light' : ''} 
                  onClick={() => setActiveTab('staff')}
                >
                  Staff Members
                </Nav.Link>
                <Nav.Link 
                  className={activeTab === 'messMenu' ? 'active bg-light' : ''} 
                  onClick={() => setActiveTab('messMenu')}
                >
                  Mess Menu
                </Nav.Link>
                <Nav.Link 
                  className={activeTab === 'gallery' ? 'active bg-light' : ''} 
                  onClick={() => setActiveTab('gallery')}
                >
                  Gallery
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9} lg={10}>
          <Card className="shadow-sm">
            <Card.Body>
              {renderTabContent()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WardenDashboard; 