import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Briefcase, Bookmark, FileText, Shield, Menu, X, User, LogOut, LogIn, ChevronRight } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import CompanyAvatar from './CompanyAvatar';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { savedJobIds } = useJobs();
  const { applications } = useApplications();
  const { currentUser, logout, switchRole, isAdmin } = useAuth();
  const navigate = useNavigate();

  const userApps = currentUser
    ? applications.filter(a => a.applicantEmail?.toLowerCase() === currentUser.email?.toLowerCase())
    : [];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon-box">
            <Briefcase size={22} className="logo-icon" />
          </div>
          <div className="logo-text-wrapper">
            <span className="logo-title">Job<span className="logo-accent">Nest</span></span>
            <span className="logo-tagline">Career Opportunities</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Find Jobs
          </NavLink>
          <NavLink to="/saved-jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Saved Jobs
            {savedJobIds.length > 0 && (
              <span className="nav-counter-badge">{savedJobIds.length}</span>
            )}
          </NavLink>
          <NavLink to="/applications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            My Applications
            {userApps.length > 0 && (
              <span className="nav-counter-badge nav-counter-green">{userApps.length}</span>
            )}
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => `nav-link nav-link-admin ${isActive ? 'active' : ''}`}>
            <Shield size={15} /> Admin Hub
          </NavLink>
        </nav>

        {/* Right side user menu */}
        <div className="navbar-actions">
          {currentUser ? (
            <div className="user-profile-menu">
              <button
                type="button"
                className="user-profile-trigger"
                onClick={() => navigate('/login')}
                title="View user profile / Switch demo user"
              >
                <div className="user-avatar-circle">
                  {currentUser.avatar || 'U'}
                </div>
                <div className="user-details-mini">
                  <span className="user-name-mini">{currentUser.name}</span>
                  <span className="user-role-mini">
                    {isAdmin ? 'Recruiter' : 'Seeker'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                className="btn-icon-logout"
                onClick={logout}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <LogIn size={15} /> Sign In
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="navbar-logo">
                <div className="logo-icon-box">
                  <Briefcase size={20} className="logo-icon" />
                </div>
                <span className="logo-title">Job<span className="logo-accent">Nest</span></span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {currentUser && (
              <div className="mobile-user-card">
                <div className="user-avatar-circle large">
                  {currentUser.avatar || 'U'}
                </div>
                <div>
                  <h4 className="m-0">{currentUser.name}</h4>
                  <p className="text-muted text-sm m-0">{currentUser.email}</p>
                  <span className={`badge-pill badge-${isAdmin ? 'purple' : 'primary'} text-xs mt-1`}>
                    {isAdmin ? 'Recruiter / Admin' : 'Job Seeker'}
                  </span>
                </div>
              </div>
            )}

            <nav className="mobile-nav-links">
              <NavLink to="/" className="mobile-nav-item" onClick={closeMenu}>
                Home <ChevronRight size={16} />
              </NavLink>
              <NavLink to="/jobs" className="mobile-nav-item" onClick={closeMenu}>
                Find Jobs <ChevronRight size={16} />
              </NavLink>
              <NavLink to="/saved-jobs" className="mobile-nav-item" onClick={closeMenu}>
                Saved Jobs
                <span className="mobile-badge">{savedJobIds.length}</span>
              </NavLink>
              <NavLink to="/applications" className="mobile-nav-item" onClick={closeMenu}>
                My Applications
                <span className="mobile-badge green">{userApps.length}</span>
              </NavLink>
              <NavLink to="/admin" className="mobile-nav-item admin-item" onClick={closeMenu}>
                <span><Shield size={16} className="inline-icon" /> Admin Dashboard</span>
                <ChevronRight size={16} />
              </NavLink>
            </nav>

            <div className="mobile-menu-footer">
              <button
                type="button"
                className="btn btn-secondary w-full mb-2"
                onClick={() => {
                  switchRole();
                  closeMenu();
                }}
              >
                Switch to {isAdmin ? 'Seeker Mode' : 'Admin Mode'}
              </button>

              {currentUser ? (
                <button
                  type="button"
                  className="btn btn-outline w-full"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary w-full"
                  onClick={closeMenu}
                >
                  <LogIn size={16} /> Sign In / Demo Accounts
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
