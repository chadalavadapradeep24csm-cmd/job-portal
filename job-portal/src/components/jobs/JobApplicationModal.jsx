import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Building2, MapPin, DollarSign, X } from 'lucide-react';
import Modal from '../common/Modal';
import CompanyAvatar from '../common/CompanyAvatar';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function JobApplicationModal({ isOpen, onClose, job }) {
  const { submitApplication } = useApplications();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experienceYears: '2',
    portfolioUrl: '',
    coverLetter: '',
    resumeFileName: 'Resume_Candidate_2026.pdf',
    resumeFileSize: '1.8 MB'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '+1 (555) 234-5678',
        experienceYears: currentUser.experienceYears || '3',
        portfolioUrl: currentUser.portfolioUrl || '',
        resumeFileName: currentUser.resumeName || 'Alex_Morgan_Resume_2026.pdf'
      }));
    }
  }, [currentUser, isOpen]);

  if (!job) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSimulatedFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFormData((prev) => ({
        ...prev,
        resumeFileName: file.name,
        resumeFileSize: `${sizeMB} MB`
      }));
      showToast(`Selected resume: ${file.name}`, 'info');
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.resumeFileName) errs.resume = 'Please attach your resume';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate smooth processing delay
    setTimeout(() => {
      submitApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        companyLogo: job.companyLogo,
        companyColor: job.companyColor,
        location: job.location,
        salary: job.salary,
        applicantName: formData.name,
        applicantEmail: formData.email,
        applicantPhone: formData.phone,
        experienceYears: formData.experienceYears,
        portfolioUrl: formData.portfolioUrl,
        resumeName: formData.resumeFileName,
        coverLetter: formData.coverLetter
      });

      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Job Application"
      maxWidth="640px"
    >
      {/* Job Preview Strip */}
      <div className="application-job-banner">
        <CompanyAvatar
          name={job.company}
          logo={job.companyLogo}
          color={job.companyColor}
          size={44}
        />
        <div className="application-job-info">
          <h4 className="application-job-title">{job.title}</h4>
          <div className="application-job-meta">
            <span>{job.company}</span>
            <span>•</span>
            <span><MapPin size={12} className="inline-icon" /> {job.location}</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">{job.salary}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-row-2">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="applicant-name" className="form-label">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              id="applicant-name"
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="applicant-email" className="form-label">
              Email Address <span className="text-danger">*</span>
            </label>
            <input
              id="applicant-email"
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row-2">
          {/* Phone */}
          <div className="form-group">
            <label htmlFor="applicant-phone" className="form-label">
              Phone Number <span className="text-danger">*</span>
            </label>
            <input
              id="applicant-phone"
              type="tel"
              name="phone"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          {/* Experience Years */}
          <div className="form-group">
            <label htmlFor="applicant-experience" className="form-label">
              Years of Experience
            </label>
            <select
              id="applicant-experience"
              name="experienceYears"
              className="form-control form-select"
              value={formData.experienceYears}
              onChange={handleChange}
            >
              <option value="0-1">0-1 year (Entry Level)</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4 years</option>
              <option value="5+">5+ years (Senior)</option>
              <option value="8+">8+ years (Staff / Lead)</option>
            </select>
          </div>
        </div>

        {/* Portfolio / LinkedIn */}
        <div className="form-group">
          <label htmlFor="applicant-portfolio" className="form-label">
            Portfolio or LinkedIn Profile (Optional)
          </label>
          <input
            id="applicant-portfolio"
            type="url"
            name="portfolioUrl"
            className="form-control"
            placeholder="https://linkedin.com/in/yourprofile or portfolio URL"
            value={formData.portfolioUrl}
            onChange={handleChange}
          />
        </div>

        {/* Resume Upload Box */}
        <div className="form-group">
          <label className="form-label">
            Resume / CV <span className="text-danger">*</span>
          </label>
          <div className="file-upload-card">
            <input
              type="file"
              id="resume-file-input"
              className="hidden-file-input"
              accept=".pdf,.doc,.docx"
              onChange={handleSimulatedFileUpload}
            />
            <label htmlFor="resume-file-input" className="file-upload-dropzone">
              <Upload size={24} className="upload-icon" />
              <div className="upload-text">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                <p className="text-xs text-muted m-0">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </label>

            {formData.resumeFileName && (
              <div className="attached-file-row">
                <div className="attached-file-info">
                  <FileText size={18} className="text-blue-600" />
                  <span className="file-name">{formData.resumeFileName}</span>
                  <span className="file-size">({formData.resumeFileSize})</span>
                </div>
                <span className="file-status-badge">Ready to send</span>
              </div>
            )}
          </div>
          {errors.resume && <span className="form-error">{errors.resume}</span>}
        </div>

        {/* Cover Letter */}
        <div className="form-group">
          <label htmlFor="applicant-cover-letter" className="form-label">
            Cover Letter / Note to Hiring Team
          </label>
          <textarea
            id="applicant-cover-letter"
            name="coverLetter"
            rows="3"
            className="form-control"
            placeholder="Share why you are an ideal fit for this role and any relevant highlights..."
            value={formData.coverLetter}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
