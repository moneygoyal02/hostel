import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface SliderImage {
  _id: string;
  url: string;
  caption?: string;
  order: number;
  publicId: string;
}

const SliderManagement: React.FC = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [images, setImages] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for new image
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [order, setOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Check if user is admin (chief warden)
    if (!userInfo || userInfo.role !== 'chiefWarden') {
      navigate('/dashboard');
    }
    
    fetchImages();
  }, [userInfo, navigate]);

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

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/slider-images');
      setImages(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images');
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
      setError('Please select an image');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        // Send to backend
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.token}`
          }
        };
        
        const response = await axios.post(
          'http://localhost:5000/api/slider-images',
          { image: base64, caption, order },
          config
        );
        
        // Reset form
        setSelectedFile(null);
        setCaption('');
        setOrder(0);
        setPreview(null);
        
        // Refresh images
        fetchImages();
      };
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`
          }
        };
        
        await axios.delete(`http://localhost:5000/api/slider-images/${id}`, config);
        setImages(images.filter(image => image._id !== id));
      } catch (err) {
        console.error('Error deleting image:', err);
        setError('Failed to delete image');
      }
    }
  };

  const handleUpdateOrder = async (id: string, newOrder: number) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`
        }
      };
      
      await axios.put(
        `http://localhost:5000/api/slider-images/${id}`,
        { order: newOrder },
        config
      );
      
      // Refresh images
      fetchImages();
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order');
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Slider Image Management</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">Add New Image</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Image</label>
                  <input
                    type="file"
                    id="image"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                
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
                
                <div className="mb-3">
                  <label htmlFor="caption" className="form-label">Caption (optional)</label>
                  <input
                    type="text"
                    id="caption"
                    className="form-control"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="order" className="form-label">Display Order</label>
                  <input
                    type="number"
                    id="order"
                    className="form-control"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value))}
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Manage Slider Images</div>
            <div className="card-body">
              {loading ? (
                <p>Loading images...</p>
              ) : images.length === 0 ? (
                <p>No images found. Add your first image!</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Caption</th>
                        <th>Order</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {images.map((image) => (
                        <tr key={image._id}>
                          <td>
                            <img
                              src={image.url}
                              alt={image.caption || 'Slider image'}
                              style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                            />
                          </td>
                          <td>{image.caption || '-'}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={image.order}
                              onChange={(e) => handleUpdateOrder(image._id, parseInt(e.target.value))}
                              style={{ width: '70px' }}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(image._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderManagement; 