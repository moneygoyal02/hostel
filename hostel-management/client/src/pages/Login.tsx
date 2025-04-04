import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [error, setError] = useState<string>('');
  const { userInfo, login, loading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    // Set error from auth context
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-5">
              <h1 className="text-center mb-4">Hostel Management</h1>
              <h2 className="h4 text-center mb-4">Warden Login</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@nitj\.ac\.in$/i,
                        message: 'Please enter a valid NITJ email address'
                      }
                    })}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    {...register('password', { required: 'Password is required' })}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/" className="text-decoration-none">Back to Home</Link>
                  <Link to="/signup" className="text-decoration-none">Create Account</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 