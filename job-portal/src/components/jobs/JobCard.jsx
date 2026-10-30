import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Bookmark, BookmarkCheck, ArrowRight, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import CompanyAvatar from '../common/CompanyAvatar';
import Badge from '../common/Badge';
import { useJobs } from '../../context/JobContext';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';

export default function JobCard({ job, onApply, layout = 'grid' }) {
  const { isJobSaved, toggleSaveJob } = useJobs();
  const { hasApplied } = useApplications();
  const { currentUser } = useAuth();

  const saved = isJobSaved(job.id);
  const applied = hasApplied(job.id, currentUser?.email);

  // Format posted date into friendly relative text
  const getRelativeDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const posted = new Date(dateStr);
    const today = new Date('2026-10-13');
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0 || isNaN(diffDays)) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const workModeVariant = job.workMode === 'Remote' ? 'success' : job.workMode === 'Hybrid' ? 'primary' : 'neutral';

  return (
    <article className={`job-card ${layout === 'list' ? 'job-card-list' : ''} ${job.featured ? 'job-card-featured' : ''}`}>
      {/* Featured / Urgent ribbons */}
      <div className="job-card-ribbons">
        {job.featured && (
          <span className="ribbon ribbon-featured">
            <Sparkles size={11} /> Featured
          </span>
        )}
        {job.urgent && (
          <span className="ribbon ribbon-urgent">Urgent Hiring</span>
        )}
      </div>

      <div className="job-card-top">
        <div className="job-card-company-header">
          <CompanyAvatar
            name={job.company}
            logo={job.companyLogo}
            color={job.companyColor}
            size={48}
          />
          <div className="job-card-title-group">
            <h3 className="job-card-title">
              <Link to={`/jobs/${job.id}`}>{job.title}</Link>
            </h3>
            <div className="job-card-company-meta">
              <span className="company-name">{job.company}</span>
              <span className="bullet-sep">•</span>
              <span className="job-category-tag">{job.category}</span>
            </div>
          </div>
        </div>

        {/* Save Bookmark button */}
        <button
          type="button"
          className={`btn-save-bookmark ${saved ? 'saved' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveJob(job.id);
          }}
          title={saved ? 'Remove from saved' : 'Save job'}
          aria-label={saved ? 'Remove from saved' : 'Save job'}
        >
          {saved ? <BookmarkCheck size={19} className="bookmark-filled" /> : <Bookmark size={19} />}
        </button>
      </div>

      {/* Badges row */}
      <div className="job-card-badges">
        <Badge variant={workModeVariant} size="sm">
          {job.workMode}
        </Badge>
        <Badge variant="neutral" size="sm">
          {job.jobType}
        </Badge>
        <Badge variant="purple" size="sm">
          {job.experience}
        </Badge>
      </div>

      {/* Meta info: Location, Salary, Posted */}
      <div className="job-card-meta-details">
        <div className="meta-item">
          <MapPin size={14} className="meta-icon" />
          <span>{job.location}</span>
        </div>
        <div className="meta-item meta-salary">
          <DollarSign size={14} className="meta-icon" />
          <span>{job.salary}</span>
        </div>
        <div className="meta-item">
          <Clock size={14} className="meta-icon" />
          <span>{getRelativeDate(job.postedDate)}</span>
        </div>
      </div>

      {/* Description Snippet */}
      {layout === 'list' && (
        <p className="job-card-snippet">
          {job.description?.substring(0, 160)}...
        </p>
      )}

      {/* Skills Tags */}
      <div className="job-card-skills">
        {job.skills?.slice(0, 4).map((skill, index) => (
          <span key={index} className="skill-pill">
            {skill}
          </span>
        ))}
        {job.skills?.length > 4 && (
          <span className="skill-pill skill-pill-more">
            +{job.skills.length - 4}
          </span>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="job-card-footer">
        <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
          View Details
        </Link>

        {applied ? (
          <button type="button" className="btn btn-applied btn-sm" disabled>
            <CheckCircle2 size={14} /> Applied
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onApply) onApply(job);
            }}
          >
            Apply Now <ArrowRight size={14} />
          </button>
        )}
      </div>
    </article>
  );
}
