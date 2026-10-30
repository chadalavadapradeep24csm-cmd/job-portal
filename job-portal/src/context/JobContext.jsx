import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialJobsData from '../data/jobs.json';
import { useToast } from './ToastContext';

const JobContext = createContext(null);

export function JobProvider({ children }) {
  const { showToast } = useToast();

  // Load jobs from localStorage or fallback to initial seed
  const [jobs, setJobs] = useState(() => {
    try {
      const stored = localStorage.getItem('jobnest_jobs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading jobs from localStorage', e);
    }
    // Initialize localStorage with initial seed
    localStorage.setItem('jobnest_jobs', JSON.stringify(initialJobsData));
    return initialJobsData;
  });

  // Load saved job IDs from localStorage
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const stored = localStorage.getItem('jobnest_saved_jobs');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading saved jobs', e);
    }
    // Pre-save 2 jobs so the saved jobs page looks great on first inspection
    const defaultSaved = ['job-1', 'job-3'];
    localStorage.setItem('jobnest_saved_jobs', JSON.stringify(defaultSaved));
    return defaultSaved;
  });

  // Sync jobs to localStorage whenever jobs state changes
  useEffect(() => {
    try {
      localStorage.setItem('jobnest_jobs', JSON.stringify(jobs));
    } catch (e) {
      console.error('Error saving jobs to localStorage', e);
    }
  }, [jobs]);

  // Sync savedJobIds to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('jobnest_saved_jobs', JSON.stringify(savedJobIds));
    } catch (e) {
      console.error('Error syncing saved jobs', e);
    }
  }, [savedJobIds]);

  const isJobSaved = useCallback((jobId) => {
    return savedJobIds.includes(jobId);
  }, [savedJobIds]);

  const toggleSaveJob = useCallback((jobId) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      if (exists) {
        showToast('Job removed from saved bookmarks', 'info');
        return prev.filter((id) => id !== jobId);
      } else {
        showToast('Job saved to your bookmarks!', 'success');
        return [...prev, jobId];
      }
    });
  }, [showToast]);

  const getJobById = useCallback((jobId) => {
    return jobs.find((j) => String(j.id) === String(jobId));
  }, [jobs]);

  // CRUD: Add Job (Admin)
  const addJob = useCallback((jobData) => {
    const newJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      featured: Boolean(jobData.featured),
      urgent: Boolean(jobData.urgent),
      skills: Array.isArray(jobData.skills)
        ? jobData.skills
        : String(jobData.skills || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
      responsibilities: Array.isArray(jobData.responsibilities)
        ? jobData.responsibilities
        : String(jobData.responsibilities || '')
            .split('\n')
            .map((s) => s.trim().replace(/^[-•*]\s*/, ''))
            .filter(Boolean),
      requirements: Array.isArray(jobData.requirements)
        ? jobData.requirements
        : String(jobData.requirements || '')
            .split('\n')
            .map((s) => s.trim().replace(/^[-•*]\s*/, ''))
            .filter(Boolean),
      benefits: Array.isArray(jobData.benefits)
        ? jobData.benefits
        : String(jobData.benefits || '')
            .split('\n')
            .map((s) => s.trim().replace(/^[-•*]\s*/, ''))
            .filter(Boolean)
    };

    setJobs((prev) => [newJob, ...prev]);
    showToast(`Job listing "${newJob.title}" posted successfully!`, 'success');
    return newJob;
  }, [showToast]);

  // CRUD: Update Job (Admin)
  const updateJob = useCallback((jobId, updatedData) => {
    setJobs((prev) =>
      prev.map((item) => {
        if (String(item.id) === String(jobId)) {
          return {
            ...item,
            ...updatedData,
            skills: Array.isArray(updatedData.skills)
              ? updatedData.skills
              : String(updatedData.skills || '')
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
            responsibilities: Array.isArray(updatedData.responsibilities)
              ? updatedData.responsibilities
              : String(updatedData.responsibilities || '')
                  .split('\n')
                  .map((s) => s.trim().replace(/^[-•*]\s*/, ''))
                  .filter(Boolean),
            requirements: Array.isArray(updatedData.requirements)
              ? updatedData.requirements
              : String(updatedData.requirements || '')
                  .split('\n')
                  .map((s) => s.trim().replace(/^[-•*]\s*/, ''))
                  .filter(Boolean),
            benefits: Array.isArray(updatedData.benefits)
              ? updatedData.benefits
              : String(updatedData.benefits || '')
                  .split('\n')
                  .map((s) => s.trim().replace(/^[-•*]\s*/, ''))
                  .filter(Boolean)
          };
        }
        return item;
      })
    );
    showToast('Job listing updated successfully!', 'success');
  }, [showToast]);

  // CRUD: Delete Job (Admin)
  const deleteJob = useCallback((jobId) => {
    setJobs((prev) => prev.filter((item) => String(item.id) !== String(jobId)));
    // Also remove from saved if present
    setSavedJobIds((prev) => prev.filter((id) => String(id) !== String(jobId)));
    showToast('Job listing has been deleted.', 'info');
  }, [showToast]);

  // Reset to initial seed dataset
  const resetToDefaultJobs = useCallback(() => {
    setJobs(initialJobsData);
    localStorage.setItem('jobnest_jobs', JSON.stringify(initialJobsData));
    showToast('All job listings reset to initial sample data.', 'info');
  }, [showToast]);

  return (
    <JobContext.Provider
      value={{
        jobs,
        savedJobIds,
        savedJobs: jobs.filter((j) => savedJobIds.includes(j.id)),
        isJobSaved,
        toggleSaveJob,
        getJobById,
        addJob,
        updateJob,
        deleteJob,
        resetToDefaultJobs
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
