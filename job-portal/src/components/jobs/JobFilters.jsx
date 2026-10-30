import React from 'react';
import { Search, MapPin, Briefcase, Filter, RotateCcw, X } from 'lucide-react';
import { CATEGORIES, JOB_LOCATIONS, JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS } from '../../data/categories';

export default function JobFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
  isMobileOpen = false,
  onCloseMobile
}) {
  return (
    <aside className={`job-filters-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="filters-header">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-blue-600" />
          <h3 className="filters-title">Filter Jobs</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-reset-filters"
            onClick={onResetFilters}
            title="Reset all filters"
          >
            <RotateCcw size={13} /> Clear All
          </button>
          {isMobileOpen && (
            <button
              type="button"
              className="modal-close-btn md-hide"
              onClick={onCloseMobile}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="filters-body">
        {/* Keyword Search */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-search">
            Search Keyword
          </label>
          <div className="input-with-icon">
            <Search size={16} className="input-icon" />
            <input
              id="filter-search"
              type="text"
              className="form-control"
              placeholder="Title, skill, or company..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-category">
            Job Category
          </label>
          <select
            id="filter-category"
            className="form-control form-select"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="All Categories">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-location">
            Location
          </label>
          <div className="input-with-icon">
            <MapPin size={16} className="input-icon" />
            <select
              id="filter-location"
              className="form-control form-select"
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
            >
              {JOB_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Work Mode Filter */}
        <div className="filter-group">
          <label className="filter-label">Work Mode</label>
          <div className="filter-options-stack">
            {WORK_MODES.map((mode) => (
              <label key={mode} className="filter-radio-label">
                <input
                  type="radio"
                  name="workMode"
                  value={mode}
                  checked={filters.workMode === mode}
                  onChange={(e) => onFilterChange('workMode', e.target.value)}
                />
                <span className="radio-custom"></span>
                <span>{mode}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job Type Filter */}
        <div className="filter-group">
          <label className="filter-label">Job Type</label>
          <div className="filter-options-stack">
            {JOB_TYPES.map((type) => (
              <label key={type} className="filter-radio-label">
                <input
                  type="radio"
                  name="jobType"
                  value={type}
                  checked={filters.jobType === type}
                  onChange={(e) => onFilterChange('jobType', e.target.value)}
                />
                <span className="radio-custom"></span>
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="filter-group">
          <label className="filter-label">Experience Level</label>
          <select
            className="form-control form-select"
            value={filters.experience}
            onChange={(e) => onFilterChange('experience', e.target.value)}
          >
            {EXPERIENCE_LEVELS.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Salary Range */}
        <div className="filter-group">
          <div className="flex justify-between items-center mb-1">
            <label className="filter-label m-0">Min Salary / Year</label>
            <span className="text-xs font-semibold text-blue-600">
              ${(filters.minSalary / 1000).toFixed(0)}k+
            </span>
          </div>
          <input
            type="range"
            min="40000"
            max="200000"
            step="10000"
            className="form-range"
            value={filters.minSalary}
            onChange={(e) => onFilterChange('minSalary', Number(e.target.value))}
          />
          <div className="range-labels">
            <span>$40k</span>
            <span>$120k</span>
            <span>$200k</span>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div className="filter-mobile-footer">
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={onCloseMobile}
          >
            Show {totalResults} Jobs
          </button>
        </div>
      )}
    </aside>
  );
}
