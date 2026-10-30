import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Mail, Phone, Calendar, FileText, ExternalLink, Briefcase, CheckCircle2 } from 'lucide-react';
import { useApplications } from '../../context/ApplicationContext';

export default function ApplicantStatusModal({ isOpen, onClose, application }) {
  const { updateApplicationStatus } = useApplications();
  const [selectedStatus, setSelectedStatus] = useState('Under Review');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    if (application) {
      setSelectedStatus(application.status || 'Under Review');
      setAdminNote(application.notes || '');
    }
  }, [application, isOpen]);

  if (!application) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateApplicationStatus(application.id, selectedStatus, adminNote);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Candidate Application"
      maxWidth="600px"
    >
      <div className="applicant-modal-body">
        <div className="applicant-profile-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="applicant-name-title">{application.applicantName}</h3>
              <p className="text-muted text-sm m-0">Applied for: <strong>{application.jobTitle}</strong> at {application.company}</p>
            </div>
            <span className={`badge-pill badge-${
              application.status === 'Interview Scheduled' ? 'purple' :
              application.status === 'Offer Received' ? 'success' :
              application.status === 'Rejected' ? 'danger' : 'primary'
            }`}>
              {application.status}
            </span>
          </div>

          <div className="applicant-contact-grid mt-3">
            <div className="contact-chip">
              <Mail size={14} /> {application.applicantEmail}
            </div>
            <div className="contact-chip">
              <Phone size={14} /> {application.applicantPhone}
            </div>
            <div className="contact-chip">
              <Calendar size={14} /> Applied on {application.appliedDate}
            </div>
            <div className="contact-chip">
              <Briefcase size={14} /> Experience: {application.experienceYears} yrs
            </div>
          </div>

          {application.portfolioUrl && (
            <div className="mt-2">
              <a
                href={application.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 font-medium inline-flex items-center gap-1"
              >
                View Portfolio / Profile <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Attached Resume */}
        <div className="applicant-resume-preview mt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              <span className="font-semibold text-sm">{application.resumeName || 'Candidate_Resume.pdf'}</span>
            </div>
            <span className="text-xs text-muted">Simulated PDF attachment</span>
          </div>
        </div>

        {/* Cover letter */}
        {application.coverLetter && (
          <div className="applicant-cover-letter-box mt-3">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Cover Letter / Candidate Note
            </h5>
            <p className="text-sm text-slate-700 m-0 whitespace-pre-line">
              "{application.coverLetter}"
            </p>
          </div>
        )}

        {/* Update Status form */}
        <form onSubmit={handleSave} className="status-update-form mt-4">
          <div className="form-group">
            <label className="form-label font-semibold">Change Application Status</label>
            <select
              className="form-control form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Offer Received">Offer Received</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label font-semibold">Recruiter Notes / Feedback</label>
            <textarea
              rows="2"
              className="form-control"
              placeholder="e.g. Cleared round 1 coding assessment. Moving to manager interview."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} /> Save Status Update
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
