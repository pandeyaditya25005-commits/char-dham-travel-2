import { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  const saveSession = useCallback((tokenData, userData) => {
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    saveSession(data.token, data.user);
    return data;
  }, [saveSession]);

  const register = useCallback(async (formData) => {
    const data = await authService.register(formData);
    return data;
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    const data = await authService.verifyOtp(email, otp);
    saveSession(data.token, data.user);
    return data;
  }, [saveSession]);

  const resendOtp = useCallback(async (email) => {
    const data = await authService.resendOtp(email);
    return data;
  }, []);

  const forgotPassword = useCallback(async (email) => {
    const data = await authService.forgotPassword(email);
    return data;
  }, []);

  const resetPassword = useCallback(async (email, otp, password) => {
    const data = await authService.resetPassword(email, otp, password);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const updateProfile = useCallback(async (profileData) => {
    const data = await authService.updateProfile(profileData);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await authService.getProfile();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        fetchProfile();
      } catch {
        clearSession();
      }
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile,
    fetchProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
