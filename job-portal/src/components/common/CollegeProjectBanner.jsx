import React, { useState } from 'react';
import { Award, RefreshCw, Users, Shield, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';

export default function CollegeProjectBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentUser, switchRole, isAdmin } = useAuth();
  const { resetToDefaultJobs } = useJobs();

  return (
    <div className="viva-banner">
      <div className="viva-banner-inner container">
        <div className="viva-banner-left">
          <span className="viva-tag">
            <Award size={14} /> College Project Demo
          </span>
          <span className="viva-desc">
            <strong>JobNest:</strong> Full-Stack Style Frontend with React.js & LocalStorage Persistence
          </span>
        </div>

        <div className="viva-banner-actions">
          <div className="viva-role-indicator">
            Active Role: 
            <span className={`role-pill ${isAdmin ? 'role-admin' : 'role-seeker'}`}>
              {isAdmin ? <Shield size={12} /> : <Users size={12} />}
              {isAdmin ? 'Admin (Sarah)' : 'Seeker (Alex)'}
            </span>
          </div>

          <button
            type="button"
            className="viva-btn viva-btn-switch"
            onClick={switchRole}
            title="Switch between Job Seeker and Admin views"
          >
            Switch to {isAdmin ? 'Seeker Mode' : 'Admin Mode'}
          </button>

          <button
            type="button"
            className="viva-btn viva-btn-reset"
            onClick={resetToDefaultJobs}
            title="Reset sample data back to initial seed"
          >
            <RefreshCw size={12} /> Reset Data
          </button>

          <button
            type="button"
            className="viva-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Toggle Viva Project Details"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="viva-details container">
          <div className="viva-grid">
            <div className="viva-info-card">
              <h4>🎯 Core Features Implemented</h4>
              <ul>
                <li><CheckCircle size={13} /> Job search by keyword, title, skills & company</li>
                <li><CheckCircle size={13} /> Multi-faceted filters (Category, Location, Type, Work mode, Salary)</li>
                <li><CheckCircle size={13} /> Save/Bookmark jobs with localStorage sync</li>
                <li><CheckCircle size={13} /> Simulated job application with resume upload simulation</li>
              </ul>
            </div>
            <div className="viva-info-card">
              <h4>🛡️ Admin & Application Tracking</h4>
              <ul>
                <li><CheckCircle size={13} /> Admin dashboard with full CRUD (Add, Edit, Delete listings)</li>
                <li><CheckCircle size={13} /> Live applicant review & status updating in Admin</li>
                <li><CheckCircle size={13} /> Synchronized "My Applications" tracking for Job Seekers</li>
                <li><CheckCircle size={13} /> Instant 1-click role switcher for viva demonstration</li>
              </ul>
            </div>
            <div className="viva-info-card">
              <h4>💻 Technical Stack & React Architecture</h4>
              <ul>
                <li><CheckCircle size={13} /> React 18, React Router, Lucide Icons, Pure CSS3</li>
                <li><CheckCircle size={13} /> Context API (Job, Auth, Application & Toast contexts)</li>
                <li><CheckCircle size={13} /> Pure component hierarchy with props & state management</li>
                <li><CheckCircle size={13} /> 100% Responsive design across mobile, tablet & desktop</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
