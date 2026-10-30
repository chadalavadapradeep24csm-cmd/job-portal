import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  RotateCcw,
  Briefcase,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import JobApplicationModal from '../components/jobs/JobApplicationModal';
import { useJobs } from '../context/JobContext';

export default function FindJobsPage() {
  const { jobs } = useJobs();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial filter state from URL query params
  const [filters, setFilters] = useState(() => ({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All Categories',
    location: searchParams.get('location') || 'All Locations',
    jobType: searchParams.get('jobType') || 'All Types',
    workMode: searchParams.get('workMode') || 'All Modes',
    experience: searchParams.get('experience') || 'All Levels',
    minSalary: Number(searchParams.get('minSalary')) || 40000
  }));

  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'salary-high' | 'title-asc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  // Sync URL params when filters change
  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (filters.search) nextParams.set('search', filters.search);
    if (filters.category && filters.category !== 'All Categories') nextParams.set('category', filters.category);
    if (filters.location && filters.location !== 'All Locations') nextParams.set('location', filters.location);
    if (filters.jobType && filters.jobType !== 'All Types') nextParams.set('jobType', filters.jobType);
    if (filters.workMode && filters.workMode !== 'All Modes') nextParams.set('workMode', filters.workMode);
    if (filters.experience && filters.experience !== 'All Levels') nextParams.set('experience', filters.experience);
    if (filters.minSalary > 40000) nextParams.set('minSalary', String(filters.minSalary));

    setSearchParams(nextParams);
    setCurrentPage(1); // Reset page on filter changes
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All Categories',
      location: 'All Locations',
      jobType: 'All Types',
      workMode: 'All Modes',
      experience: 'All Levels',
      minSalary: 40000
    });
  };

  // Filter and sort computation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search term
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = job.title?.toLowerCase().includes(query);
        const matchesCompany = job.company?.toLowerCase().includes(query);
        const matchesDesc = job.description?.toLowerCase().includes(query);
        const matchesSkills = job.skills?.some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesSkills) {
          return false;
        }
      }

      // Category
      if (filters.category !== 'All Categories' && job.category !== filters.category) {
        return false;
      }

      // Location
      if (filters.location !== 'All Locations') {
        if (filters.location === 'Remote') {
          if (job.workMode !== 'Remote') return false;
        } else if (!job.location?.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Job Type
      if (filters.jobType !== 'All Types' && job.jobType !== filters.jobType) {
        return false;
      }

      // Work Mode
      if (filters.workMode !== 'All Modes' && job.workMode !== filters.workMode) {
        return false;
      }

      // Experience Level
      if (filters.experience !== 'All Levels' && job.experience !== filters.experience) {
        return false;
      }

      // Salary filter
      if (filters.minSalary > 40000) {
        const jobSalaryMax = job.salaryMax || 0;
        if (jobSalaryMax < filters.minSalary) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'salary-high') {
        return (b.salaryMax || 0) - (a.salaryMax || 0);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      // 'recent' by default
      return new Date(b.postedDate) - new Date(a.postedDate);
    });
  }, [jobs, filters, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return filteredJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [filteredJobs, currentPage, jobsPerPage]);

  // Compute active filters pills
  const activeFilters = [];
  if (filters.search) activeFilters.push({ label: `"${filters.search}"`, key: 'search', defaultVal: '' });
  if (filters.category !== 'All Categories') activeFilters.push({ label: filters.category, key: 'category', defaultVal: 'All Categories' });
  if (filters.location !== 'All Locations') activeFilters.push({ label: filters.location, key: 'location', defaultVal: 'All Locations' });
  if (filters.jobType !== 'All Types') activeFilters.push({ label: filters.jobType, key: 'jobType', defaultVal: 'All Types' });
  if (filters.workMode !== 'All Modes') activeFilters.push({ label: filters.workMode, key: 'workMode', defaultVal: 'All Modes' });
  if (filters.experience !== 'All Levels') activeFilters.push({ label: filters.experience, key: 'experience', defaultVal: 'All Levels' });
  if (filters.minSalary > 40000) activeFilters.push({ label: `$${filters.minSalary / 1000}k+`, key: 'minSalary', defaultVal: 40000 });

  return (
    <div className="find-jobs-page container section-padding">
      {/* Page Title & Breadcrumb */}
      <div className="page-header-box">
        <h1 className="page-title">Browse Career Opportunities</h1>
        <p className="page-subtitle">
          Showing verified openings across engineering, product, design, and data.
        </p>
      </div>

      <div className="find-jobs-layout">
        {/* Sidebar Filter Component */}
        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={filteredJobs.length}
          isMobileOpen={isMobileFiltersOpen}
          onCloseMobile={() => setIsMobileFiltersOpen(false)}
        />

        {/* Main Listings Column */}
        <main className="find-jobs-main" aria-label="Job Listings">
          {/* Controls Bar: Count, Sort, View Toggle */}
          <div className="listings-control-bar">
            <div className="results-count-group">
              <span className="results-count-text">
                Showing <strong>{filteredJobs.length}</strong> jobs
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm md-filter-toggle-btn"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <SlidersHorizontal size={15} /> Filters ({activeFilters.length})
              </button>
            </div>

            <div className="controls-right-group">
              {/* Sort By Dropdown */}
              <div className="sort-by-control">
                <label htmlFor="sort-select" className="sort-label">Sort:</label>
                <select
                  id="sort-select"
                  className="form-control form-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="salary-high">Highest Salary</option>
                  <option value="title-asc">Title (A-Z)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="view-mode-toggle">
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                  aria-label="List View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {activeFilters.length > 0 && (
            <div className="active-filters-bar">
              <span className="active-filters-label">Active:</span>
              <div className="active-pills-list">
                {activeFilters.map((pill) => (
                  <span key={pill.key} className="active-filter-pill">
                    {pill.label}
                    <button
                      type="button"
                      onClick={() => handleFilterChange(pill.key, pill.defaultVal)}
                      aria-label={`Remove filter ${pill.label}`}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  className="btn-clear-all-pills"
                  onClick={handleResetFilters}
                >
                  Reset all
                </button>
              </div>
            </div>
          )}

          {/* Job Listings Grid or List */}
          {paginatedJobs.length > 0 ? (
            <>
              <div className={viewMode === 'grid' ? 'jobs-grid-2' : 'jobs-list-layout'}>
                {paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    layout={viewMode}
                    onApply={(j) => setSelectedJobForApply(j)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-bar">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span className="page-indicator">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="empty-state-card text-center">
              <div className="empty-state-icon bg-blue-50 text-blue-600">
                <Briefcase size={36} />
              </div>
              <h3 className="empty-state-title">No matching jobs found</h3>
              <p className="empty-state-text">
                We couldn't find any positions matching your specific filter criteria.
                Try adjusting your search terms or clearing some filters.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleResetFilters}
              >
                <RotateCcw size={15} /> Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Application Modal */}
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
