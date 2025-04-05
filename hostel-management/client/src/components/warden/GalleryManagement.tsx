import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

interface GalleryImage {
  _id: string;
  url: string;
  caption?: string;
  order: number;
  publicId: string;
}

interface GalleryManagementProps {
  hostelId: string;
}

const GalleryManagement: React.FC<GalleryManagementProps> = ({ hostelId }) => {
  const { userInfo } = useContext(AuthContext);
  
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State for new image
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [order, setOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [activeTab, setActiveTab] = useState<'gallery' | 'mess'>('gallery');

  useEffect(() => {
    fetchImages(activeTab);
  }, [hostelId, activeTab]);

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

  const fetchImages = async (type: 'gallery' | 'mess') => {
    try {
      setLoading(true);
      const endpoint = type === 'gallery' ? 'gallery-images' : 'mess-images';
      const response = await axios.get(`http://localhost:5000/api/hostels/${hostelId}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`
        }
      });
      setImages(response.data);
      setError(null);
    } catch (err: any) {
      console.error(`Error fetching ${activeTab} images:`, err);
      setError(err.response?.data?.message || `Failed to load ${activeTab} images`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('caption', caption);
    formData.append('order', order.toString());
    
    try {
      setUploading(true);
      setError(null);
      
      const endpoint = activeTab === 'gallery' ? 'gallery-images' : 'mess-images';
      await axios.post(`http://localhost:5000/api/hostels/${hostelId}/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo?.token}`
        }
      });
      
      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setCaption('');
      setOrder(0);
      
      // Show success message
      setSuccess('Image uploaded successfully');
      
      // Refresh images list
      fetchImages(activeTab);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
      setSuccess(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        setLoading(true);
        const endpoint = activeTab === 'gallery' ? 'gallery-images' : 'mess-images';
        await axios.delete(`http://localhost:5000/api/hostels/${hostelId}/${endpoint}/${imageId}`, {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`
          }
        });
        
        // Refresh images
        fetchImages(activeTab);
        setSuccess('Image deleted successfully');
      } catch (err: any) {
        console.error('Error deleting image:', err);
        setError(err.response?.data?.message || 'Failed to delete image');
        setSuccess(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h4 className="mb-4">Gallery Management</h4>
      
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              Hostel Gallery
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'mess' ? 'active' : ''}`}
              onClick={() => setActiveTab('mess')}
            >
              Mess Images
            </button>
          </li>
        </ul>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              {activeTab === 'gallery' ? 'Hostel Gallery Images' : 'Mess Images'}
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : images.length === 0 ? (
                <Alert variant="info">No images found. Add some images to display.</Alert>
              ) : (
                <Row>
                  {images.map(image => (
                    <Col sm={6} md={4} lg={3} key={image._id} className="mb-3">
                      <Card>
                        <Card.Img 
                          variant="top" 
                          src={image.url} 
                          alt={image.caption || 'Gallery image'} 
                          style={{ height: '160px', objectFit: 'cover' }}
                        />
                        <Card.Body className="p-2">
                          {image.caption && (
                            <p className="small mb-1 text-truncate">
                              <strong>Caption:</strong> {image.caption}
                            </p>
                          )}
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDeleteImage(image._id)}
                            className="mt-2 w-100"
                          >
                            Delete
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              Add New {activeTab === 'gallery' ? 'Gallery' : 'Mess'} Image
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </Form.Group>
                
                {preview && (
                  <div className="mb-3">
                    <img
                      src={preview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Label>Caption (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    disabled={uploading}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Display Order</Form.Label>
                  <Form.Control
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value))}
                    disabled={uploading}
                  />
                  <Form.Text className="text-muted">
                    Images will be displayed in ascending order
                  </Form.Text>
                </Form.Group>
                
                <Button type="submit" variant="primary" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Uploading...</span>
                    </>
                  ) : (
                    'Upload Image'
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

export default GalleryManagement; 