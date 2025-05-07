import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await axios.get('/api/auth/check', { 
          withCredentials: true 
        });
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const register = async (name, email, password) => {
    const { data } = await axios.post(
      '/api/auth/register', 
      { name, email, password }, 
      { withCredentials: true }
    );
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await axios.post(
      '/api/auth/login', 
      { email, password }, 
      { withCredentials: true }
    );
    setUser(data);
  };

  const verifyPassword = async (enteredPassword) => {
    try {
      const { data } = await axios.post(
        '/api/auth/verify-password',
        { password: enteredPassword },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return data.isValid;
    } catch (error) {
      console.error('Verification error:', error);
      if (error.response && error.response.status === 404) {
        throw new Error('Verification service unavailable');
      }
      throw new Error('Verification failed. Please try again.');
    }
  };
  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      register, 
      login, 
      logout,
      verifyPassword // Now properly included
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
