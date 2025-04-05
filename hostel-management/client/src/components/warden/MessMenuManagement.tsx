import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Form, Button, Card, Alert, Spinner, Table } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

interface MessMenu {
  _id: string;
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

interface MessMenuManagementProps {
  hostelId: string;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MessMenuManagement: React.FC<MessMenuManagementProps> = ({ hostelId }) => {
  const { userInfo } = useContext(AuthContext);
  
  const [menuItems, setMenuItems] = useState<MessMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State for new/editing menu item
  const [day, setDay] = useState('Monday');
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [snacks, setSnacks] = useState('');
  const [dinner, setDinner] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMessMenu();
  }, [hostelId]);

  const fetchMessMenu = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/hostels/${hostelId}/mess-menu`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`
        }
      });
      setMenuItems(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching mess menu:', err);
      setError(err.response?.data?.message || 'Failed to load mess menu');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDay('Monday');
    setBreakfast('');
    setLunch('');
    setSnacks('');
    setDinner('');
    setEditMode(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!day || !breakfast || !lunch || !snacks || !dinner) {
      setError('All fields are required');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const menuData = {
        day,
        breakfast,
        lunch,
        snacks,
        dinner
      };
      
      if (editMode && editingId) {
        // Update existing menu item
        await axios.put(`http://localhost:5000/api/hostels/${hostelId}/mess-menu/${editingId}`, menuData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`
          }
        });
        setSuccess('Mess menu updated successfully');
      } else {
        // Add new menu item
        await axios.post(`http://localhost:5000/api/hostels/${hostelId}/mess-menu`, menuData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`
          }
        });
        setSuccess('Mess menu added successfully');
      }
      
      // Reset form and refresh menu items
      resetForm();
      fetchMessMenu();
    } catch (err: any) {
      console.error('Error managing mess menu:', err);
      setError(err.response?.data?.message || 'Failed to save mess menu');
      setSuccess(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (menu: MessMenu) => {
    setDay(menu.day);
    setBreakfast(menu.breakfast);
    setLunch(menu.lunch);
    setSnacks(menu.snacks);
    setDinner(menu.dinner);
    setEditMode(true);
    setEditingId(menu._id);
  };

  return (
    <div>
      <h4 className="mb-4">Mess Menu Management</h4>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col lg={12} className="mb-4">
          <Card>
            <Card.Header>Current Mess Menu</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : menuItems.length === 0 ? (
                <Alert variant="info">No mess menu found. Add menu items using the form below.</Alert>
              ) : (
                <Table responsive striped bordered>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Breakfast</th>
                      <th>Lunch</th>
                      <th>Snacks</th>
                      <th>Dinner</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...menuItems]
                      .sort((a, b) => {
                        const dayOrder = { 
                          Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, 
                          Friday: 5, Saturday: 6, Sunday: 7 
                        };
                        return dayOrder[a.day as keyof typeof dayOrder] - dayOrder[b.day as keyof typeof dayOrder];
                      })
                      .map(menu => (
                        <tr key={menu._id}>
                          <td>{menu.day}</td>
                          <td>{menu.breakfast}</td>
                          <td>{menu.lunch}</td>
                          <td>{menu.snacks}</td>
                          <td>{menu.dinner}</td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              onClick={() => handleEdit(menu)}
                              className="me-2"
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={12}>
          <Card>
            <Card.Header>{editMode ? 'Edit Mess Menu' : 'Add New Mess Menu'}</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Day *</Form.Label>
                      <Form.Select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        disabled={submitting}
                        required
                      >
                        {days.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Breakfast *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={breakfast}
                        onChange={(e) => setBreakfast(e.target.value)}
                        disabled={submitting}
                        required
                        placeholder="e.g. Bread, Butter, Jam, Milk, Tea, Coffee"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Lunch *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={lunch}
                        onChange={(e) => setLunch(e.target.value)}
                        disabled={submitting}
                        required
                        placeholder="e.g. Rice, Dal, Vegetables, Salad, Curd"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Snacks *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={snacks}
                        onChange={(e) => setSnacks(e.target.value)}
                        disabled={submitting}
                        required
                        placeholder="e.g. Samosa, Tea, Coffee"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Dinner *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={dinner}
                        onChange={(e) => setDinner(e.target.value)}
                        disabled={submitting}
                        required
                        placeholder="e.g. Roti, Vegetables, Rice, Dal, Salad"
                      />
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end mt-4">
                      {editMode && (
                        <Button 
                          type="button" 
                          variant="outline-secondary" 
                          onClick={resetForm} 
                          disabled={submitting}
                          className="me-2"
                        >
                          Cancel
                        </Button>
                      )}
                      
                      <Button type="submit" variant="primary" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            <span className="ms-2">Saving...</span>
                          </>
                        ) : (
                          editMode ? 'Update Menu' : 'Add Menu'
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MessMenuManagement; 