import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await axios.get(
          'https://frontend-of-stock-prediction-system-fs3v.onrender.com/api/auth/check', 
          { withCredentials: true }
        );
        setUser(data);
      } catch (err) {
        console.error("Auth check failed:", err.response?.data || err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const register = async (name, email, password) => {
  try {
    const { data } = await axios.post(
      'https://frontend-of-stock-prediction-system-fs3v.onrender.com/api/auth/register',
      { name, email, password },
      { withCredentials: true }
    );
    setUser(data);
  } catch (err) {
    console.error("Register error:", err.response?.data || err.message);
    throw err;
  }
};


  const login = async (email, password) => {
    const { data } = await axios.post(
      'https://frontend-of-stock-prediction-system-fs3v.onrender.com/api/auth/login', 
      { email, password }, 
      { withCredentials: true }
    );
    setUser(data);
  };

  const verifyPassword = async (enteredPassword) => {
    try {
      const { data } = await axios.post(
        'https://frontend-of-stock-prediction-system-fs3v.onrender.com/api/auth/verify-password',
        { password: enteredPassword },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return data.isValid;
    } catch (error) {
      console.error('Verification error:', error);
      throw new Error('Verification failed. Please try again.');
    }
  };

  const logout = async () => {
    await axios.post(
      'https://frontend-of-stock-prediction-system-fs3v.onrender.com/api/auth/logout', 
      {}, 
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      register, 
      login, 
      logout,
      verifyPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
