// client/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService, type User, type LoginCredentials, type UserCreateData } from '@/lib/api.ts';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      setUser(response.user);
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserCreateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      setUser(response.user);
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = authService.isAuthenticated();

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };
};