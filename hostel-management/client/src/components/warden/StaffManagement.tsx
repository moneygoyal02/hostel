import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Form, Button, Card, Alert, Spinner, Table } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { StaffMember } from '../../types';
import { FileChangeHandler, FormSubmitHandler } from '../../types/events';

interface StaffManagementProps {
  hostelId: string;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ hostelId }) => {
  const { userInfo } = useContext(AuthContext);
  
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State for new staff member
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, [hostelId]);

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

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/hostels/${hostelId}/staff`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`
        }
      });
      setStaffMembers(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching staff:', err);
      setError(err.response?.data?.message || 'Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange: FileChangeHandler = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit: FormSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!name || !role) {
      setError('Name and role are required');
      return;
    }
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    
    if (email) formData.append('email', email);
    if (phone) formData.append('phone', phone);
    if (selectedFile) formData.append('photo', selectedFile);
    
    try {
      setSubmitting(true);
      setError(null);
      
      await axios.post(`http://localhost:5000/api/hostels/${hostelId}/staff`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo?.token}`
        }
      });
      
      // Reset form
      setName('');
      setRole('');
      setEmail('');
      setPhone('');
      setSelectedFile(null);
      setPreview(null);
      
      // Show success message
      setSuccess('Staff member added successfully');
      
      // Refresh staff list
      fetchStaff();
    } catch (err: any) {
      console.error('Error adding staff member:', err);
      setError(err.response?.data?.message || 'Failed to add staff member');
      setSuccess(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/hostels/${hostelId}/staff/${staffId}`, {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`
          }
        });
        
        // Refresh staff
        fetchStaff();
        setSuccess('Staff member deleted successfully');
      } catch (err: any) {
        console.error('Error deleting staff member:', err);
        setError(err.response?.data?.message || 'Failed to delete staff member');
        setSuccess(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h4 className="mb-4">Staff Management</h4>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Current Staff Members</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : staffMembers.length === 0 ? (
                <Alert variant="info">No staff members found. Add staff members to display.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffMembers.map(staff => (
                      <tr key={staff._id}>
                        <td>
                          {staff.photo ? (
                            <img 
                              src={staff.photo} 
                              alt={staff.name} 
                              className="img-thumbnail" 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div 
                              className="bg-secondary text-white d-flex align-items-center justify-content-center"
                              style={{ width: '50px', height: '50px', borderRadius: '4px' }}
                            >
                              {staff.name.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td>{staff.name}</td>
                        <td>{staff.role}</td>
                        <td>
                          {staff.email && <div>{staff.email}</div>}
                          {staff.phone && <div>{staff.phone}</div>}
                        </td>
                        <td>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDeleteStaff(staff._id!)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>Add New Staff Member</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Role *</Form.Label>
                  <Form.Control
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={submitting}
                    required
                    placeholder="e.g. Assistant Warden, Caretaker"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitting}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={submitting}
                  />
                </Form.Group>
                
                {preview && (
                  <div className="mb-3">
                    <img
                      src={preview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxHeight: '150px' }}
                    />
                  </div>
                )}
                
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Submitting...</span>
                    </>
                  ) : (
                    'Add Staff Member'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StaffManagement; 