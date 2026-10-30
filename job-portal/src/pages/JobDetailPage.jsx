import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Building2,
  Globe,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import CompanyAvatar from '../components/common/CompanyAvatar';
import Badge from '../components/common/Badge';
import JobApplicationModal from '../components/jobs/JobApplicationModal';
import { useJobs } from '../context/JobContext';
import { useApplications } from '../context/ApplicationContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById, isJobSaved, toggleSaveJob, jobs } = useJobs();
  const { hasApplied, applications } = useApplications();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const job = getJobById(id);

  if (!job) {
    return (
      <div className="container section-padding text-center">
        <div className="empty-state-card">
          <Briefcase size={40} className="text-muted mb-2" />
          <h2>Job Listing Not Found</h2>
          <p className="text-muted">The job listing you requested may have been removed or does not exist.</p>
          <Link to="/jobs" className="btn btn-primary mt-3">
            <ArrowLeft size={16} /> Back to Job Listings
          </Link>
        </div>
      </div>
    );
  }

  const saved = isJobSaved(job.id);
  const applied = hasApplied(job.id, currentUser?.email);

  // Find user's specific application if applied
  const userApplication = applications.find(
    (a) => String(a.jobId) === String(job.id) && a.applicantEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  // Similar jobs
  const similarJobs = jobs
    .filter((j) => j.id !== job.id && (j.category === job.category || j.workMode === job.workMode))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Job listing link copied to clipboard!', 'success');
  };

  const workModeVariant = job.workMode === 'Remote' ? 'success' : job.workMode === 'Hybrid' ? 'primary' : 'neutral';

  return (
    <div className="job-detail-page container section-padding">
      {/* Breadcrumb Navigation */}
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to="/jobs">Find Jobs</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{job.title}</span>
      </nav>

      {/* Main Header Banner */}
      <div className="job-detail-header-card">
        <div className="detail-header-left">
          <CompanyAvatar
            name={job.company}
            logo={job.companyLogo}
            color={job.companyColor}
            size={72}
          />
          <div className="detail-header-titles">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="detail-job-title">{job.title}</h1>
              {job.featured && (
                <Badge variant="warning" size="sm">
                  <Sparkles size={12} /> Featured
                </Badge>
              )}
            </div>

            <div className="detail-company-meta">
              <span className="detail-company-name">{job.company}</span>
              <span className="bullet-sep">•</span>
              <span className="detail-location">
                <MapPin size={14} className="inline-icon" /> {job.location}
              </span>
              <span className="bullet-sep">•</span>
              <Badge variant={workModeVariant} size="sm">
                {job.workMode}
              </Badge>
              <span className="bullet-sep">•</span>
              <Badge variant="neutral" size="sm">
                {job.jobType}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons Top Right */}
        <div className="detail-header-actions">
          <button
            type="button"
            className="btn btn-outline btn-icon"
            onClick={handleShare}
            title="Share job link"
          >
            <Share2 size={18} />
          </button>

          <button
            type="button"
            className={`btn btn-outline ${saved ? 'btn-saved' : ''}`}
            onClick={() => toggleSaveJob(job.id)}
            title={saved ? 'Remove Bookmark' : 'Bookmark Job'}
          >
            {saved ? <BookmarkCheck size={18} className="text-blue-600" /> : <Bookmark size={18} />}
            <span>{saved ? 'Saved' : 'Save Job'}</span>
          </button>

          {applied ? (
            <div className="applied-pill-banner">
              <CheckCircle2 size={16} /> Applied ({userApplication?.status || 'Under Review'})
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => setIsApplyModalOpen(true)}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Already applied informational alert */}
      {applied && (
        <div className="applied-alert-box">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-500" />
            <div>
              <h4 className="m-0 text-emerald-900 font-semibold">You have submitted an application for this role</h4>
              <p className="text-emerald-700 text-sm m-0">
                Current status: <strong>{userApplication?.status || 'Under Review'}</strong>. You can view or track your application from the My Applications page.
              </p>
            </div>
          </div>
          <Link to="/applications" className="btn btn-outline btn-sm bg-white">
            View My Applications
          </Link>
        </div>
      )}

      {/* Grid Layout: Content & Sidebar */}
      <div className="detail-content-layout">
        <main className="detail-main-column">
          {/* Quick Metrics Bar */}
          <div className="job-key-metrics-grid">
            <div className="metric-box">
              <span className="metric-label">Salary Range</span>
              <span className="metric-value text-emerald-600 font-bold">{job.salary}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Experience</span>
              <span className="metric-value">{job.experience}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Work Environment</span>
              <span className="metric-value">{job.workMode}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Category</span>
              <span className="metric-value">{job.category}</span>
            </div>
          </div>

          {/* Description Section */}
          <section className="detail-section">
            <h2 className="detail-section-title">About the Role</h2>
            <p className="detail-text-paragraph">{job.description}</p>
          </section>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className="detail-section">
              <h2 className="detail-section-title">Key Responsibilities</h2>
              <ul className="detail-bullet-list">
                {job.responsibilities.map((resp, i) => (
                  <li key={i}>
                    <Check size={16} className="bullet-check-icon" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <section className="detail-section">
              <h2 className="detail-section-title">Qualifications & Requirements</h2>
              <ul className="detail-bullet-list">
                {job.requirements.map((req, i) => (
                  <li key={i}>
                    <Check size={16} className="bullet-check-icon" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <section className="detail-section">
              <h2 className="detail-section-title">Technologies & Skills</h2>
              <div className="skills-tags-cluster">
                {job.skills.map((skill, i) => (
                  <button
                    key={i}
                    type="button"
                    className="skill-pill-interactive"
                    onClick={() => navigate(`/jobs?search=${encodeURIComponent(skill)}`)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Benefits & Perks */}
          {job.benefits && job.benefits.length > 0 && (
            <section className="detail-section">
              <h2 className="detail-section-title">Perks & Benefits</h2>
              <div className="benefits-grid">
                {job.benefits.map((benefit, i) => (
                  <div key={i} className="benefit-item-card">
                    <CheckCircle2 size={18} className="text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-800">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar Column */}
        <aside className="detail-sidebar-column">
          {/* Company Card */}
          <div className="company-sidebar-card">
            <h3 className="sidebar-card-title">About {job.company}</h3>
            <p className="company-overview-desc">
              {job.companyOverview?.about || `${job.company} is a leading digital software and technology organization.`}
            </p>

            <div className="company-meta-items">
              <div className="company-meta-row">
                <span className="meta-row-label">Industry</span>
                <span className="meta-row-value">{job.companyOverview?.industry || job.category}</span>
              </div>
              <div className="company-meta-row">
                <span className="meta-row-label">Company Size</span>
                <span className="meta-row-value">{job.companyOverview?.size || '1,000+ employees'}</span>
              </div>
              <div className="company-meta-row">
                <span className="meta-row-label">Founded</span>
                <span className="meta-row-value">{job.companyOverview?.founded || '2012'}</span>
              </div>
              {job.companyOverview?.website && (
                <div className="company-meta-row">
                  <span className="meta-row-label">Website</span>
                  <a
                    href={job.companyOverview.website}
                    target="_blank"
                    rel="noreferrer"
                    className="meta-row-link"
                  >
                    Visit Site <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            <div className="sidebar-apply-box mt-4">
              {!applied ? (
                <button
                  type="button"
                  className="btn btn-primary w-full"
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  Apply For This Job
                </button>
              ) : (
                <button type="button" className="btn btn-applied w-full" disabled>
                  <CheckCircle2 size={16} /> Application Submitted
                </button>
              )}
            </div>
          </div>

          {/* Similar Opportunities */}
          {similarJobs.length > 0 && (
            <div className="similar-jobs-card">
              <h3 className="sidebar-card-title">Similar Openings</h3>
              <div className="similar-jobs-list">
                {similarJobs.map((simJob) => (
                  <Link
                    key={simJob.id}
                    to={`/jobs/${simJob.id}`}
                    className="similar-job-item"
                  >
                    <CompanyAvatar
                      name={simJob.company}
                      logo={simJob.companyLogo}
                      color={simJob.companyColor}
                      size={36}
                    />
                    <div className="similar-job-info">
                      <h4 className="similar-job-title">{simJob.title}</h4>
                      <p className="similar-job-meta">
                        {simJob.company} • {simJob.location}
                      </p>
                      <span className="similar-job-salary">{simJob.salary}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Application Modal */}
      {isApplyModalOpen && (
        <JobApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          job={job}
        />
      )}
    </div>
  );
}
