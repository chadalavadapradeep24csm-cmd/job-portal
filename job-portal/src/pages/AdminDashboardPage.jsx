import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Briefcase,
  Users,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Filter,
  Eye
} from 'lucide-react';
import CompanyAvatar from '../components/common/CompanyAvatar';
import Badge from '../components/common/Badge';
import JobFormModal from '../components/admin/JobFormModal';
import ApplicantStatusModal from '../components/admin/ApplicantStatusModal';
import { useJobs } from '../context/JobContext';
import { useApplications } from '../context/ApplicationContext';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { jobs, deleteJob, resetToDefaultJobs } = useJobs();
  const { applications } = useApplications();
  const { currentUser, switchRole, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'applicants'
  const [jobSearch, setJobSearch] = useState('');
  const [applicantSearch, setApplicantSearch] = useState('');
  const [filterJobId, setFilterJobId] = useState('ALL');

  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [reviewingApplicant, setReviewingApplicant] = useState(null);

  // Filter jobs
  const filteredJobs = jobs.filter((j) => {
    if (!jobSearch) return true;
    const q = jobSearch.toLowerCase();
    return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.category.toLowerCase().includes(q);
  });

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    if (filterJobId !== 'ALL' && String(app.jobId) !== String(filterJobId)) {
      return false;
    }
    if (!applicantSearch) return true;
    const q = applicantSearch.toLowerCase();
    return (
      app.applicantName.toLowerCase().includes(q) ||
      app.applicantEmail.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q)
    );
  });

  const handleOpenAddJob = () => {
    setEditingJob(null);
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job) => {
    setEditingJob(job);
    setIsJobModalOpen(true);
  };

  const handleDeleteJob = (job) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}" at ${job.company}? This action will remove it from the portal.`)) {
      deleteJob(job.id);
    }
  };

  const handleOpenReviewApplicant = (app) => {
    setReviewingApplicant(app);
    setIsStatusModalOpen(true);
  };

  return (
    <div className="admin-dashboard-page container section-padding">
      {/* Admin Header with Banner */}
      <div className="admin-header-card">
        <div className="admin-header-left">
          <div className="admin-badge-icon">
            <Shield size={28} className="text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="admin-title">Recruiter & Admin Hub</h1>
              <Badge variant="purple" size="sm">Admin Portal</Badge>
            </div>
            <p className="admin-subtext">
              Manage job vacancies, publish new roles, and update candidate application statuses in real time.
            </p>
          </div>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenAddJob}
          >
            <Plus size={16} /> Post New Vacancy
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={resetToDefaultJobs}
            title="Reset dataset to default 16 seed jobs"
          >
            <RotateCcw size={14} /> Reset Seed Data
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="admin-kpi-grid mt-4">
        <div className="admin-kpi-card">
          <div className="kpi-icon-box bg-blue-50 text-blue-600">
            <Briefcase size={22} />
          </div>
          <div>
            <span className="kpi-value">{jobs.length}</span>
            <span className="kpi-label">Active Job Openings</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-box bg-purple-50 text-purple-600">
            <Users size={22} />
          </div>
          <div>
            <span className="kpi-value">{applications.length}</span>
            <span className="kpi-label">Applications Received</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-box bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="kpi-value">
              {applications.filter((a) => a.status === 'Interview Scheduled' || a.status === 'Offer Received').length}
            </span>
            <span className="kpi-label">Interviews / Offers</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-box bg-amber-50 text-amber-600">
            <Sparkles size={22} />
          </div>
          <div>
            <span className="kpi-value">
              {jobs.filter((j) => j.featured).length}
            </span>
            <span className="kpi-label">Featured Vacancies</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav-tabs mt-4">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={16} /> Job Listings ({jobs.length})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'applicants' ? 'active' : ''}`}
          onClick={() => setActiveTab('applicants')}
        >
          <Users size={16} /> Candidate Submissions ({applications.length})
        </button>
      </div>

      {/* TAB 1: Job Listings Management Table */}
      {activeTab === 'jobs' && (
        <div className="admin-table-container mt-3">
          <div className="table-filter-bar">
            <div className="search-input-wrapper">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Search listings by title, company, or category..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
              />
            </div>
            <span className="text-muted text-sm">
              Showing <strong>{filteredJobs.length}</strong> of {jobs.length} jobs
            </span>
          </div>

          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Job Title & Company</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Mode / Type</th>
                  <th>Salary Range</th>
                  <th>Applicants</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => {
                  const applicantCount = applications.filter((a) => String(a.jobId) === String(job.id)).length;

                  return (
                    <tr key={job.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <CompanyAvatar
                            name={job.company}
                            logo={job.companyLogo}
                            color={job.companyColor}
                            size={38}
                          />
                          <div>
                            <span className="table-job-title">{job.title}</span>
                            <span className="table-company-sub">{job.company}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant="neutral" size="sm">{job.category}</Badge>
                      </td>
                      <td>
                        <span className="text-sm">{job.location}</span>
                      </td>
                      <td>
                        <div className="flex gap-1 flex-wrap">
                          <Badge
                            variant={job.workMode === 'Remote' ? 'success' : job.workMode === 'Hybrid' ? 'primary' : 'neutral'}
                            size="sm"
                          >
                            {job.workMode}
                          </Badge>
                          <Badge variant="neutral" size="sm">
                            {job.jobType}
                          </Badge>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm font-semibold text-emerald-600">{job.salary}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="applicant-counter-pill"
                          onClick={() => {
                            setFilterJobId(job.id);
                            setActiveTab('applicants');
                          }}
                          title="View applicants for this job"
                        >
                          {applicantCount} {applicantCount === 1 ? 'applicant' : 'applicants'}
                        </button>
                      </td>
                      <td className="text-right">
                        <div className="action-buttons-group">
                          <button
                            type="button"
                            className="btn-action-edit"
                            onClick={() => handleOpenEditJob(job)}
                            title="Edit Listing"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-action-delete"
                            onClick={() => handleDeleteJob(job)}
                            title="Delete Listing"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Applications Received & Status Management */}
      {activeTab === 'applicants' && (
        <div className="admin-table-container mt-3">
          <div className="table-filter-bar">
            <div className="search-input-wrapper">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Search candidates by name, email, or role..."
                value={applicantSearch}
                onChange={(e) => setApplicantSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500">Job:</label>
              <select
                className="form-control form-select-sm"
                value={filterJobId}
                onChange={(e) => setFilterJobId(e.target.value)}
              >
                <option value="ALL">All Jobs</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.company})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Applied For</th>
                    <th>Date</th>
                    <th>Resume</th>
                    <th>Status</th>
                    <th>Recruiter Notes</th>
                    <th className="text-right">Review</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div>
                          <span className="font-semibold text-slate-900 block">{app.applicantName}</span>
                          <span className="text-xs text-muted block">{app.applicantEmail}</span>
                          <span className="text-xs text-muted">{app.applicantPhone}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span className="font-medium text-slate-800 block">{app.jobTitle}</span>
                          <span className="text-xs text-muted">{app.company}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs text-slate-600">{app.appliedDate}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <FileText size={14} />
                          <span>{app.resumeName || 'Resume.pdf'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge-pill badge-${
                          app.status === 'Interview Scheduled' ? 'purple' :
                          app.status === 'Offer Received' ? 'success' :
                          app.status === 'Rejected' ? 'danger' : 'primary'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs text-slate-600 block max-w-xs truncate">
                          {app.notes || '—'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleOpenReviewApplicant(app)}
                        >
                          <Eye size={14} /> Review & Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-card text-center p-4">
              <p className="text-muted m-0">No candidate submissions match your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Job Modal */}
      {isJobModalOpen && (
        <JobFormModal
          isOpen={isJobModalOpen}
          onClose={() => {
            setIsJobModalOpen(false);
            setEditingJob(null);
          }}
          editingJob={editingJob}
        />
      )}

      {/* Candidate Status Review Modal */}
      {isStatusModalOpen && (
        <ApplicantStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => {
            setIsStatusModalOpen(false);
            setReviewingApplicant(null);
          }}
          application={reviewingApplicant}
        />
      )}
    </div>
  );
}
