import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Shield,
  Briefcase,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  LogOut,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth, DEMO_SEEKER, DEMO_ADMIN } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { currentUser, loginAs, loginWithCustom, logout, switchRole, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seeker');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter an email address', 'warning');
      return;
    }
    const derivedName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    loginWithCustom({
      name: derivedName,
      email,
      role
    });
    showToast(`Logged in successfully as ${derivedName} (${role === 'admin' ? 'Admin' : 'Job Seeker'})!`, 'success');
    navigate(role === 'admin' ? '/admin' : '/jobs');
  };

  const handleOneClick = (roleType) => {
    loginAs(roleType);
    showToast(`Switched account to ${roleType === 'admin' ? 'Recruiter Admin (Sarah Chen)' : 'Job Seeker (Alex Morgan)'}!`, 'success');
    navigate(roleType === 'admin' ? '/admin' : '/jobs');
  };

  return (
    <div className="login-page-container container section-padding">
      <div className="login-wrapper">
        <div className="login-header text-center">
          <div className="login-icon-box">
            <Lock size={28} className="text-blue-600" />
          </div>
          <h1 className="login-title">Simulated Authentication</h1>
          <p className="login-subtitle">
            Demonstrate simulated user roles with 1-click accounts or custom credentials.
          </p>
        </div>

        {/* If user is currently logged in, show their active profile status */}
        {currentUser ? (
          <div className="current-user-card">
            <div className="user-profile-header">
              <div className="user-avatar-circle large">
                {currentUser.avatar || 'U'}
              </div>
              <div>
                <h3 className="m-0 font-bold text-lg">{currentUser.name}</h3>
                <p className="text-muted text-sm m-0">{currentUser.email}</p>
                <div className="mt-1">
                  <span className={`role-pill ${isAdmin ? 'role-admin' : 'role-seeker'}`}>
                    {isAdmin ? <Shield size={12} /> : <User size={12} />}
                    {isAdmin ? 'Recruiter / Admin Mode' : 'Job Seeker Mode'}
                  </span>
                </div>
              </div>
            </div>

            <div className="user-details-list mt-3">
              {currentUser.title && (
                <div className="user-detail-row">
                  <span className="text-muted">Title:</span>
                  <span className="font-semibold">{currentUser.title}</span>
                </div>
              )}
              {currentUser.location && (
                <div className="user-detail-row">
                  <span className="text-muted">Location:</span>
                  <span>{currentUser.location}</span>
                </div>
              )}
              {currentUser.experienceYears && (
                <div className="user-detail-row">
                  <span className="text-muted">Experience:</span>
                  <span>{currentUser.experienceYears} Years</span>
                </div>
              )}
            </div>

            <div className="user-card-actions mt-4">
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={switchRole}
              >
                Switch to {isAdmin ? 'Job Seeker (Alex Morgan)' : 'Recruiter Admin (Sarah Chen)'}
              </button>

              <div className="flex gap-2 w-full mt-2">
                <Link to={isAdmin ? '/admin' : '/jobs'} className="btn btn-outline flex-1">
                  Go to {isAdmin ? 'Admin Dashboard' : 'Find Jobs'} <ArrowRight size={14} />
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={logout}
                  title="Sign Out"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* 1-Click Demo Accounts */}
        <div className="demo-accounts-box mt-4">
          <span className="demo-section-label">⚡ 1-Click Demo Accounts (Viva Demonstration)</span>

          <div className="demo-buttons-grid">
            {/* Seeker Card */}
            <div
              className="demo-account-card seeker-card"
              onClick={() => handleOneClick('seeker')}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3">
                <div className="demo-avatar bg-blue-100 text-blue-600">
                  <User size={22} />
                </div>
                <div>
                  <h4 className="demo-name">Alex Morgan</h4>
                  <span className="demo-role-tag">Job Seeker</span>
                  <p className="demo-email">alex.morgan@example.com</p>
                </div>
              </div>
              <div className="demo-action-text">
                Click to log in as Seeker <ArrowRight size={14} />
              </div>
            </div>

            {/* Admin Card */}
            <div
              className="demo-account-card admin-card"
              onClick={() => handleOneClick('admin')}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3">
                <div className="demo-avatar bg-purple-100 text-purple-600">
                  <Shield size={22} />
                </div>
                <div>
                  <h4 className="demo-name">Sarah Chen</h4>
                  <span className="demo-role-tag admin">Recruiter & Admin</span>
                  <p className="demo-email">sarah.chen@jobnest.com</p>
                </div>
              </div>
              <div className="demo-action-text">
                Click to log in as Admin <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Login Form */}
        <div className="custom-login-form-box mt-4">
          <h3 className="custom-form-title">Or Sign In with Custom Details</h3>
          <form onSubmit={handleCustomSubmit} className="mt-3">
            <div className="form-group">
              <label className="form-label" htmlFor="custom-email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="custom-email"
                  type="email"
                  className="form-control"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="custom-password">Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="custom-password"
                  type="password"
                  className="form-control"
                  placeholder="Any password for simulated demo..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Role</label>
              <div className="flex gap-4">
                <label className="filter-radio-label">
                  <input
                    type="radio"
                    name="loginRole"
                    value="seeker"
                    checked={role === 'seeker'}
                    onChange={() => setRole('seeker')}
                  />
                  <span className="radio-custom"></span>
                  <span>Job Seeker</span>
                </label>
                <label className="filter-radio-label">
                  <input
                    type="radio"
                    name="loginRole"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={() => setRole('admin')}
                  />
                  <span className="radio-custom"></span>
                  <span>Recruiter / Admin</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2">
              Sign In to JobNest
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
