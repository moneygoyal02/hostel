import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { UserInfo } from '../types';

interface AuthContextType {
  userInfo: UserInfo | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  userInfo: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  loading: false,
  error: null
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo) as UserInfo;
        setUserInfo(parsedUserInfo);
        
        // Set default Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUserInfo.token}`;
      } catch (error) {
        console.error('Error parsing user info', error);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const data = response.data as UserInfo;
      
      // Store user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Set user info state
      setUserInfo(data);
      
      // Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create the user
      const response = await axios.post('http://localhost:5000/api/auth/register', { 
        name, 
        email, 
        password
      });
      
      const data = response.data as UserInfo;
      
      // Store user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Set user info state
      setUserInfo(data);
      
      // Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during signup');
      throw new Error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove user info from localStorage
    localStorage.removeItem('userInfo');
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user info state
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}; 