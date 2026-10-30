import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Clock,
  Building2,
  MapPin,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import CompanyAvatar from '../components/common/CompanyAvatar';
import Badge from '../components/common/Badge';
import { useApplications } from '../context/ApplicationContext';
import { useAuth } from '../context/AuthContext';

export default function MyApplicationsPage() {
  const { applications, withdrawApplication } = useApplications();
  const { currentUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Filter applications for current user (or show all if guest)
  const userApps = currentUser
    ? applications.filter(
        (a) => !currentUser.email || a.applicantEmail?.toLowerCase() === currentUser.email?.toLowerCase()
      )
    : applications;

  const filteredApps = userApps.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  // Calculate status counts
  const countUnderReview = userApps.filter((a) => a.status === 'Under Review' || a.status === 'Submitted').length;
  const countInterview = userApps.filter((a) => a.status === 'Interview Scheduled' || a.status === 'Shortlisted').length;
  const countOffer = userApps.filter((a) => a.status === 'Offer Received').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Offer Received':
        return <Badge variant="success" size="md">🎉 Offer Received</Badge>;
      case 'Interview Scheduled':
        return <Badge variant="purple" size="md">📅 Interview Scheduled</Badge>;
      case 'Shortlisted':
        return <Badge variant="primary" size="md">⭐ Shortlisted</Badge>;
      case 'Rejected':
        return <Badge variant="danger" size="md">Not Selected</Badge>;
      default:
        return <Badge variant="warning" size="md">⏳ Under Review</Badge>;
    }
  };

  return (
    <div className="applications-page container section-padding">
      <div className="page-header-box">
        <h1 className="page-title">My Job Applications</h1>
        <p className="page-subtitle">
          Track real-time progress, review recruiter feedback, and manage your submissions.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="app-stats-row">
        <div className="app-stat-box">
          <span className="app-stat-num text-blue-600">{userApps.length}</span>
          <span className="app-stat-lbl">Total Applied</span>
        </div>
        <div className="app-stat-box">
          <span className="app-stat-num text-amber-600">{countUnderReview}</span>
          <span className="app-stat-lbl">Under Review</span>
        </div>
        <div className="app-stat-box">
          <span className="app-stat-num text-purple-600">{countInterview}</span>
          <span className="app-stat-lbl">Interviews / Shortlisted</span>
        </div>
        <div className="app-stat-box">
          <span className="app-stat-num text-emerald-600">{countOffer}</span>
          <span className="app-stat-lbl">Offers Received</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="application-filter-tabs">
        {['ALL', 'Under Review', 'Interview Scheduled', 'Offer Received'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`tab-btn ${filterStatus === tab ? 'active' : ''}`}
            onClick={() => setFilterStatus(tab)}
          >
            {tab === 'ALL' ? 'All Applications' : tab}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApps.length > 0 ? (
        <div className="applications-list-stack mt-4">
          {filteredApps.map((app) => (
            <div key={app.id} className="application-card-item">
              <div className="app-card-header">
                <div className="app-card-company-group">
                  <CompanyAvatar
                    name={app.company}
                    logo={app.companyLogo}
                    color={app.companyColor}
                    size={48}
                  />
                  <div>
                    <h3 className="app-card-title">
                      <Link to={`/jobs/${app.jobId}`}>{app.jobTitle}</Link>
                    </h3>
                    <div className="app-card-meta">
                      <span className="font-semibold text-slate-800">{app.company}</span>
                      <span className="bullet-sep">•</span>
                      <span><MapPin size={13} className="inline-icon" /> {app.location}</span>
                      <span className="bullet-sep">•</span>
                      <span className="text-emerald-600 font-medium">{app.salary}</span>
                    </div>
                  </div>
                </div>

                <div className="app-status-badge-wrapper">
                  {getStatusBadge(app.status)}
                </div>
              </div>

              {/* Application Details Body */}
              <div className="app-card-body">
                <div className="app-details-grid">
                  <div className="app-detail-item">
                    <Calendar size={14} className="text-muted" />
                    <span>Applied on: <strong>{app.appliedDate}</strong></span>
                  </div>
                  <div className="app-detail-item">
                    <FileText size={14} className="text-muted" />
                    <span>Resume: <strong>{app.resumeName || 'Resume.pdf'}</strong></span>
                  </div>
                  <div className="app-detail-item">
                    <UserCheck size={14} className="text-muted" />
                    <span>Applicant: <strong>{app.applicantName}</strong></span>
                  </div>
                </div>

                {/* Recruiter Note if present */}
                {app.notes && (
                  <div className="app-recruiter-notes">
                    <div className="notes-header">
                      <Clock size={14} /> Recruiter Feedback:
                    </div>
                    <p className="notes-text">{app.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="app-card-footer">
                <Link to={`/jobs/${app.jobId}`} className="btn btn-outline btn-sm">
                  View Job Listing <ExternalLink size={13} />
                </Link>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to withdraw your application for "${app.jobTitle}"?`)) {
                      withdrawApplication(app.id);
                    }
                  }}
                  title="Withdraw application"
                >
                  <Trash2 size={13} /> Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-card text-center mt-4">
          <div className="empty-state-icon bg-blue-50 text-blue-600">
            <FileText size={36} />
          </div>
          <h3 className="empty-state-title">No applications found</h3>
          <p className="empty-state-text">
            {filterStatus === 'ALL'
              ? 'You have not submitted any job applications yet.'
              : `No applications with status "${filterStatus}".`}
          </p>
          <Link to="/jobs" className="btn btn-primary">
            Find Opportunities to Apply <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
