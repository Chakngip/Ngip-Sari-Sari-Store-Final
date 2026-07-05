import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ngip_user');
    return stored ? JSON.parse(stored) : null;
  });

  console.log("AuthContext user:", user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function login(credentials) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', credentials);

      console.log("API RESPONSE:", data);

      localStorage.setItem('ngip_token', data.token);
      localStorage.setItem('ngip_user', JSON.stringify(data.user));

      console.log("LOCAL STORAGE USER:", localStorage.getItem("ngip_user"));

      setUser(data.user);

      console.log("SET USER:", data.user);

      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('ngip_token', data.token);
      localStorage.setItem('ngip_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('ngip_token');
    localStorage.removeItem('ngip_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
