import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { CATEGORIES, JOB_LOCATIONS } from '../../data/categories';

export default function JobSearchHero() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [category, setCategory] = useState('All Categories');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('search', keyword.trim());
    if (location && location !== 'All Locations') params.set('location', location);
    if (category && category !== 'All Categories') params.set('category', category);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    navigate(`/jobs${queryString}`);
  };

  return (
    <form className="hero-search-form" onSubmit={handleSearch}>
      <div className="search-field-group">
        <div className="search-field">
          <Search size={20} className="search-field-icon" />
          <div className="search-field-inner">
            <label htmlFor="hero-keyword">Job Title or Keyword</label>
            <input
              id="hero-keyword"
              type="text"
              placeholder="e.g. React Developer, UI Designer"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        <div className="search-divider"></div>

        <div className="search-field">
          <MapPin size={20} className="search-field-icon" />
          <div className="search-field-inner">
            <label htmlFor="hero-location">Location</label>
            <select
              id="hero-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {JOB_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-divider"></div>

        <div className="search-field">
          <Briefcase size={20} className="search-field-icon" />
          <div className="search-field-inner">
            <label htmlFor="hero-category">Category</label>
            <select
              id="hero-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All Categories">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button type="submit" className="hero-search-submit-btn">
        <span>Find Jobs</span>
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
