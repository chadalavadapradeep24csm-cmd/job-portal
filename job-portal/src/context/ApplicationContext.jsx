import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const ApplicationContext = createContext(null);

const INITIAL_APPLICATIONS = [
  {
    id: "app-101",
    jobId: "job-1",
    jobTitle: "Senior Frontend Engineer (React)",
    company: "Stripe",
    companyLogo: "ST",
    companyColor: "#635bff",
    location: "San Francisco, CA",
    salary: "$145,000 - $185,000 / yr",
    applicantName: "Alex Morgan",
    applicantEmail: "alex.morgan@example.com",
    applicantPhone: "+1 (555) 234-5678",
    experienceYears: "4",
    portfolioUrl: "https://alexmorgan.dev",
    resumeName: "Alex_Morgan_Resume_2026.pdf",
    coverLetter: "I have 4+ years of specialized React and TypeScript experience building high-scale financial dashboards. I would love to contribute to Stripe's merchant portal.",
    status: "Under Review", // 'Submitted' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Offer Received' | 'Rejected'
    appliedDate: "2026-10-12",
    notes: "Portfolio looks solid. Matching technical stack."
  },
  {
    id: "app-102",
    jobId: "job-2",
    jobTitle: "Full Stack Developer",
    company: "Vercel",
    companyLogo: "VC",
    companyColor: "#000000",
    location: "New York, NY",
    salary: "$125,000 - $160,000 / yr",
    applicantName: "Alex Morgan",
    applicantEmail: "alex.morgan@example.com",
    applicantPhone: "+1 (555) 234-5678",
    experienceYears: "3",
    portfolioUrl: "https://github.com/alexmorgan",
    resumeName: "Alex_Morgan_Resume_2026.pdf",
    coverLetter: "Next.js and Edge functions are my core passion. Excited to build the future of the web with Vercel.",
    status: "Interview Scheduled",
    appliedDate: "2026-10-10",
    notes: "Initial recruiter screen passed. Technical round scheduled for Thursday."
  }
];

export function ApplicationProvider({ children }) {
  const { showToast } = useToast();

  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem('jobnest_applications');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading applications from localStorage', e);
    }
    localStorage.setItem('jobnest_applications', JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('jobnest_applications', JSON.stringify(applications));
    } catch (e) {
      console.error('Error syncing applications', e);
    }
  }, [applications]);

  const submitApplication = useCallback((appData) => {
    const newApp = {
      id: `app-${Date.now()}`,
      status: "Under Review",
      appliedDate: new Date().toISOString().split('T')[0],
      ...appData
    };

    setApplications((prev) => [newApp, ...prev]);
    showToast(`Application successfully submitted for ${appData.jobTitle}!`, 'success');
    return newApp;
  }, [showToast]);

  const withdrawApplication = useCallback((appId) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    showToast('Application withdrawn successfully.', 'info');
  }, [showToast]);

  const updateApplicationStatus = useCallback((appId, newStatus, adminNote = '') => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: newStatus,
            notes: adminNote || app.notes
          };
        }
        return app;
      })
    );
    showToast(`Application status updated to "${newStatus}"!`, 'success');
  }, [showToast]);

  const hasApplied = useCallback((jobId, userEmail) => {
    return applications.some(
      (a) => String(a.jobId) === String(jobId) && (!userEmail || a.applicantEmail?.toLowerCase() === userEmail?.toLowerCase())
    );
  }, [applications]);

  const getApplicationsByUser = useCallback((userEmail) => {
    if (!userEmail) return applications;
    return applications.filter(
      (a) => a.applicantEmail?.toLowerCase() === userEmail.toLowerCase()
    );
  }, [applications]);

  const getApplicationsByJob = useCallback((jobId) => {
    return applications.filter((a) => String(a.jobId) === String(jobId));
  }, [applications]);

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        submitApplication,
        withdrawApplication,
        updateApplicationStatus,
        hasApplied,
        getApplicationsByUser,
        getApplicationsByJob
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
}
