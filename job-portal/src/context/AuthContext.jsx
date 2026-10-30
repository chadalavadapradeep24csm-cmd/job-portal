import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEMO_SEEKER = {
  id: "user-seeker-1",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  role: "seeker", // 'seeker' | 'admin'
  title: "Frontend Developer",
  avatar: "AM",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  experienceYears: "3",
  portfolioUrl: "https://alexmorgan.dev",
  resumeName: "Alex_Morgan_Resume_2026.pdf"
};

export const DEMO_ADMIN = {
  id: "user-admin-1",
  name: "Sarah Chen",
  email: "sarah.chen@jobnest.com",
  role: "admin",
  title: "Talent Acquisition Lead",
  avatar: "SC",
  company: "JobNest Recruiter Hub",
  location: "New York, NY"
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('jobnest_currentUser');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse current user from localStorage', e);
    }
    // Default to Job Seeker for first-time visitor
    return DEMO_SEEKER;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('jobnest_currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('jobnest_currentUser');
      }
    } catch (e) {
      console.error('Failed to save current user to localStorage', e);
    }
  }, [currentUser]);

  const loginAs = (role) => {
    if (role === 'admin') {
      setCurrentUser(DEMO_ADMIN);
    } else {
      setCurrentUser(DEMO_SEEKER);
    }
  };

  const loginWithCustom = (userData) => {
    setCurrentUser({
      id: "user-" + Date.now(),
      role: userData.role || 'seeker',
      avatar: (userData.name || 'User').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      ...userData
    });
  };

  const logout = () => {
    // For demo purposes, we can reset to null or prompt login
    setCurrentUser(null);
  };

  const switchRole = () => {
    if (currentUser?.role === 'admin') {
      setCurrentUser(DEMO_SEEKER);
    } else {
      setCurrentUser(DEMO_ADMIN);
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isSeeker = currentUser?.role === 'seeker';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginAs,
        loginWithCustom,
        logout,
        switchRole,
        isAdmin,
        isSeeker
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
