import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Briefcase, ArrowRight, Trash2, Search } from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import JobApplicationModal from '../components/jobs/JobApplicationModal';
import { useJobs } from '../context/JobContext';

export default function SavedJobsPage() {
  const { savedJobs, toggleSaveJob } = useJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  const filteredSavedJobs = savedJobs.filter((job) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="saved-jobs-page container section-padding">
      <div className="page-header-flex">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookmarkCheck size={26} className="text-blue-600" />
            <h1 className="page-title m-0">My Saved Bookmarks</h1>
          </div>
          <p className="page-subtitle">
            You have <strong>{savedJobs.length}</strong> saved positions stored in your browser.
          </p>
        </div>

        {savedJobs.length > 0 && (
          <div className="header-search-box">
            <Search size={16} className="input-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {savedJobs.length > 0 ? (
        filteredSavedJobs.length > 0 ? (
          <div className="jobs-grid-3 mt-4">
            {filteredSavedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={(j) => setSelectedJobForApply(j)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state-card text-center mt-4">
            <p className="text-muted">No saved jobs match "{searchQuery}".</p>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </button>
          </div>
        )
      ) : (
        <div className="empty-state-card text-center">
          <div className="empty-state-icon bg-blue-50 text-blue-600">
            <Bookmark size={36} />
          </div>
          <h3 className="empty-state-title">No Saved Jobs Yet</h3>
          <p className="empty-state-text">
            Bookmark interesting jobs by clicking the bookmark icon on any job card.
            They will be saved here so you can review and apply when you are ready.
          </p>
          <Link to="/jobs" className="btn btn-primary">
            Browse Job Openings <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {selectedJobForApply && (
        <JobApplicationModal
          isOpen={Boolean(selectedJobForApply)}
          onClose={() => setSelectedJobForApply(null)}
          job={selectedJobForApply}
        />
      )}
    </div>
  );
}
