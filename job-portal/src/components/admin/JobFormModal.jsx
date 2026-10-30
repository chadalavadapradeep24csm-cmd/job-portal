import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { CATEGORIES, JOB_LOCATIONS, JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS } from '../../data/categories';
import { useJobs } from '../../context/JobContext';

export default function JobFormModal({ isOpen, onClose, editingJob = null }) {
  const { addJob, updateJob } = useJobs();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyLogo: '',
    companyColor: '#2563eb',
    category: 'Software Engineering',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    workMode: 'Remote',
    experience: 'Mid Level',
    salary: '$120,000 - $150,000 / yr',
    salaryMin: 120000,
    salaryMax: 150000,
    featured: false,
    urgent: false,
    skills: 'React, TypeScript, CSS, JavaScript',
    description: '',
    responsibilities: 'Build performant UI components\nCollaborate with design team\nWrite automated tests',
    requirements: '3+ years experience with modern JavaScript\nStrong communication skills',
    benefits: 'Comprehensive health coverage\nRemote stipend\n401k matching',
    companySize: '500+ employees',
    website: 'https://example.com'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title || '',
        company: editingJob.company || '',
        companyLogo: editingJob.companyLogo || '',
        companyColor: editingJob.companyColor || '#2563eb',
        category: editingJob.category || 'Software Engineering',
        location: editingJob.location || 'San Francisco, CA',
        jobType: editingJob.jobType || 'Full-time',
        workMode: editingJob.workMode || 'Remote',
        experience: editingJob.experience || 'Mid Level',
        salary: editingJob.salary || '',
        salaryMin: editingJob.salaryMin || 100000,
        salaryMax: editingJob.salaryMax || 140000,
        featured: Boolean(editingJob.featured),
        urgent: Boolean(editingJob.urgent),
        skills: Array.isArray(editingJob.skills) ? editingJob.skills.join(', ') : (editingJob.skills || ''),
        description: editingJob.description || '',
        responsibilities: Array.isArray(editingJob.responsibilities) ? editingJob.responsibilities.join('\n') : (editingJob.responsibilities || ''),
        requirements: Array.isArray(editingJob.requirements) ? editingJob.requirements.join('\n') : (editingJob.requirements || ''),
        benefits: Array.isArray(editingJob.benefits) ? editingJob.benefits.join('\n') : (editingJob.benefits || ''),
        companySize: editingJob.companyOverview?.size || '500+ employees',
        website: editingJob.companyOverview?.website || 'https://example.com'
      });
    } else {
      // Reset form
      setFormData({
        title: '',
        company: '',
        companyLogo: '',
        companyColor: '#2563eb',
        category: 'Software Engineering',
        location: 'San Francisco, CA',
        jobType: 'Full-time',
        workMode: 'Remote',
        experience: 'Mid Level',
        salary: '$120,000 - $150,000 / yr',
        salaryMin: 120000,
        salaryMax: 150000,
        featured: false,
        urgent: false,
        skills: 'React, TypeScript, CSS, JavaScript',
        description: 'We are seeking a talented engineer to join our fast-paced product engineering team.',
        responsibilities: 'Build scalable customer-facing features\nCollaborate across product and UX teams\nEnsure high test coverage',
        requirements: '3+ years experience with modern web development\nDeep understanding of frontend state management',
        benefits: 'Health, Dental, & Vision coverage\nFlexible PTO\nAnnual learning stipend',
        companySize: '500+ employees',
        website: 'https://example.com'
      });
    }
    setErrors({});
  }, [editingJob, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Job title is required';
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.salary.trim()) errs.salary = 'Salary range is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      companyOverview: {
        about: `${formData.company} is an innovative company delivering high-impact solutions.`,
        size: formData.companySize,
        industry: formData.category,
        founded: '2018',
        website: formData.website
      }
    };

    if (editingJob) {
      updateJob(editingJob.id, payload);
    } else {
      addJob(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingJob ? 'Edit Job Listing' : 'Post a New Job Vacancy'}
      maxWidth="760px"
    >
      <form onSubmit={handleSubmit} className="admin-job-form">
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label" htmlFor="job-title">
              Job Title <span className="text-danger">*</span>
            </label>
            <input
              id="job-title"
              name="title"
              type="text"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. Senior Frontend Engineer"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="job-company">
              Company Name <span className="text-danger">*</span>
            </label>
            <input
              id="job-company"
              name="company"
              type="text"
              className={`form-control ${errors.company ? 'is-invalid' : ''}`}
              placeholder="e.g. Acme Tech"
              value={formData.company}
              onChange={handleChange}
            />
            {errors.company && <span className="form-error">{errors.company}</span>}
          </div>
        </div>

        <div className="form-row-3">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-control form-select"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              name="location"
              type="text"
              className="form-control"
              placeholder="e.g. San Francisco, CA"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Work Mode</label>
            <select
              name="workMode"
              className="form-control form-select"
              value={formData.workMode}
              onChange={handleChange}
            >
              {WORK_MODES.filter((m) => m !== 'All Modes').map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row-3">
          <div className="form-group">
            <label className="form-label">Job Type</label>
            <select
              name="jobType"
              className="form-control form-select"
              value={formData.jobType}
              onChange={handleChange}
            >
              {JOB_TYPES.filter((t) => t !== 'All Types').map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Experience Level</label>
            <select
              name="experience"
              className="form-control form-select"
              value={formData.experience}
              onChange={handleChange}
            >
              {EXPERIENCE_LEVELS.filter((e) => e !== 'All Levels').map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Salary Range <span className="text-danger">*</span>
            </label>
            <input
              name="salary"
              type="text"
              className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
              placeholder="e.g. $130,000 - $160,000 / yr"
              value={formData.salary}
              onChange={handleChange}
            />
            {errors.salary && <span className="form-error">{errors.salary}</span>}
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Required Skills (comma separated)</label>
            <input
              name="skills"
              type="text"
              className="form-control"
              placeholder="React, TypeScript, Redux, Node.js"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand Color & Initials</label>
            <div className="flex gap-2">
              <input
                type="color"
                name="companyColor"
                className="color-picker-input"
                value={formData.companyColor}
                onChange={handleChange}
                title="Choose brand color"
              />
              <input
                name="companyLogo"
                type="text"
                maxLength={3}
                className="form-control"
                placeholder="Initials (e.g. AC)"
                value={formData.companyLogo}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Job Description <span className="text-danger">*</span>
          </label>
          <textarea
            name="description"
            rows="3"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            placeholder="Comprehensive description of the role and opportunity..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Key Responsibilities (one per line)</label>
            <textarea
              name="responsibilities"
              rows="3"
              className="form-control"
              placeholder="Bullet 1&#10;Bullet 2&#10;Bullet 3"
              value={formData.responsibilities}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Requirements (one per line)</label>
            <textarea
              name="requirements"
              rows="3"
              className="form-control"
              placeholder="Requirement 1&#10;Requirement 2&#10;Requirement 3"
              value={formData.requirements}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Checkbox options */}
        <div className="form-checkbox-row">
          <label className="checkbox-control">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            <span className="checkbox-custom"></span>
            <span>Feature this job on Home page</span>
          </label>

          <label className="checkbox-control">
            <input
              type="checkbox"
              name="urgent"
              checked={formData.urgent}
              onChange={handleChange}
            />
            <span className="checkbox-custom"></span>
            <span>Mark as Urgent Hiring</span>
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {editingJob ? 'Update Job Listing' : 'Publish Job Listing'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
