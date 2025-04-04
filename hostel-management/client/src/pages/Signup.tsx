import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const [error, setError] = useState<string>('');
  const { userInfo, signup, loading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<SignupForm>();

  const password = watch('password');

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

  const onSubmit = async (data: SignupForm) => {
    try {
      setError('');
      await signup(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-5">
              <h1 className="text-center mb-4">Hostel Management</h1>
              <h2 className="h4 text-center mb-4">Warden Signup</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    {...register('name', { 
                      required: 'Name is required'
                    })}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>
                
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
                  <small className="form-text text-muted">
                    Must be a valid NITJ email (e.g., hwb1@nitj.ac.in)
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
                
                <p className="text-center mb-0">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 