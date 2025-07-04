import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Simulate API call with demo accounts
      let mockUser = null;
      
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        mockUser = {
          id: 1,
          name: 'Super Admin',
          email: credentials.email,
          role: 'super_admin',
          outlets: ['all'],
          permissions: {
            customers: true,
            sales: true,
            pos: true,
            services: true,
            inventory: true,
            appointments: true,
            staff: true,
            expenses: true,
            coupons: true,
            analytics: true,
            reports: true,
            settings: true
          }
        };
      } else if (credentials.email === 'owner@example.com' && credentials.password === 'owner123') {
        mockUser = {
          id: 2,
          name: 'Franchise Owner',
          email: credentials.email,
          role: 'franchise_owner',
          outlets: ['outlet_1'],
          permissions: {
            customers: true,
            sales: true,
            pos: true,
            services: true,
            inventory: true,
            appointments: true,
            staff: true,
            expenses: true,
            coupons: true,
            analytics: true,
            reports: true,
            settings: true
          }
        };
      } else if (credentials.email === 'manager@example.com' && credentials.password === 'manager123') {
        mockUser = {
          id: 3,
          name: 'Store Manager',
          email: credentials.email,
          role: 'franchise_manager',
          outlets: ['outlet_1'],
          permissions: {
            customers: true,
            sales: true,
            pos: true,
            services: true,
            inventory: true,
            appointments: true,
            staff: false,
            expenses: false,
            coupons: false,
            analytics: true,
            reports: true,
            settings: false
          }
        };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission) => {
    return user?.permissions?.[permission] || false;
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') return user.role === roles;
    return roles.includes(user.role);
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    hasRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};