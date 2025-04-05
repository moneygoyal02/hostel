import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Hostel } from '../../types';
import { FileChangeHandler, FormSubmitHandler, InputChangeHandler, TextAreaChangeHandler } from '../../types/events';

interface ProfileManagementProps {
  hostel: Hostel;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ hostel }) => {
  const { userInfo } = useContext(AuthContext);
  
  const [about, setAbout] = useState(hostel.about || '');
  const [wardenName, setWardenName] = useState(hostel.wardenName || '');
  const [wardenMessage, setWardenMessage] = useState(hostel.wardenMessage || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create preview when file is selected
  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange: FileChangeHandler = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit: FormSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!about || !wardenName || !wardenMessage) {
      setError('All fields except warden photo are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('about', about);
      formData.append('wardenName', wardenName);
      formData.append('wardenMessage', wardenMessage);
      
      if (selectedFile) {
        formData.append('wardenPhoto', selectedFile);
      }
      
      await axios.put(
        `http://localhost:5000/api/hostels/${hostel._id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo?.token}`
          }
        }
      );
      
      setSuccess('Hostel profile updated successfully');
    } catch (err: any) {
      console.error('Error updating hostel profile:', err);
      setError(err.response?.data?.message || 'Failed to update hostel profile');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4">Hostel Profile Management</h4>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Update Hostel Information</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Hostel Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={hostel.name}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Hostel name cannot be changed
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Hostel Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={hostel.type === 'boys' ? 'Boys Hostel' : 'Girls Hostel'}
                    disabled
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Warden Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={hostel.wardenEmail}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Email address is managed by the administrator
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Warden Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={wardenName}
                    onChange={(e) => setWardenName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>About Hostel *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Provide detailed information about the hostel"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Warden's Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={wardenMessage}
                    onChange={(e) => setWardenMessage(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="A message from the warden to the students"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Warden's Photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Upload a new photo or leave empty to keep the current one
                  </Form.Text>
                </Form.Group>
                
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Saving...</span>
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>Current Warden Photo</Card.Header>
            <Card.Body className="text-center">
              {hostel.wardenPhoto ? (
                <img 
                  src={hostel.wardenPhoto} 
                  alt={`${hostel.wardenName}`}
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: '220px' }}
                />
              ) : (
                <div className="bg-light p-5 rounded mb-3">
                  <span className="text-muted">No photo available</span>
                </div>
              )}
              
              {preview && (
                <>
                  <h6 className="mt-4 mb-2">New Photo Preview</h6>
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: '220px' }}
                  />
                </>
              )}
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>Hostel Basic Information</Card.Header>
            <Card.Body>
              <p><strong>Hostel Code:</strong> {hostel.code}</p>
              <p><strong>Email:</strong> {hostel.wardenEmail}</p>
              <p className="small text-muted mb-0">For any changes to your hostel type, code, or email, please contact the administrator.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileManagement; 