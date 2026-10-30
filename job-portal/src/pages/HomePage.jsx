import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileCheck,
  Award,
  Zap,
  DollarSign
} from 'lucide-react';
import JobSearchHero from '../components/jobs/JobSearchHero';
import JobCard from '../components/jobs/JobCard';
import JobApplicationModal from '../components/jobs/JobApplicationModal';
import { useJobs } from '../context/JobContext';
import { CATEGORIES } from '../data/categories';

export default function HomePage() {
  const { jobs } = useJobs();
  const navigate = useNavigate();
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  // Filter featured and recent jobs
  const featuredJobs = jobs.filter((j) => j.featured).slice(0, 4);
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
    .slice(0, 4);

  const quickPills = ['React', 'Remote', 'UI/UX Design', 'Next.js', 'Python', 'Internship'];

  return (
    <div className="home-page-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-glow-blob hero-glow-1"></div>
        <div className="hero-glow-blob hero-glow-2"></div>

        <div className="container hero-content text-center">
          <div className="hero-badge">
            <Sparkles size={14} className="text-blue-500" />
            <span>Over 15,000+ Verified Positions Live</span>
          </div>

          <h1 className="hero-headline">
            Find Your <span className="text-gradient">Dream Job</span> Today
          </h1>

          <p className="hero-subheading">
            Connect directly with world-class tech companies, high-growth startups, and visionary teams.
            Discover curated opportunities designed for your career aspirations.
          </p>

          {/* Integrated Search Box */}
          <div className="hero-search-wrapper">
            <JobSearchHero />
          </div>

          {/* Quick Keywords */}
          <div className="hero-quick-tags">
            <span className="quick-tags-label">Popular Searches:</span>
            {quickPills.map((tag) => (
              <button
                key={tag}
                type="button"
                className="quick-tag-pill"
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS METRICS BAR */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper bg-blue-50 text-blue-600">
                <Briefcase size={24} />
              </div>
              <div className="stat-info">
                <h3 className="stat-number">15,400+</h3>
                <p className="stat-label">Active Job Openings</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper bg-indigo-50 text-indigo-600">
                <Building2 size={24} />
              </div>
              <div className="stat-info">
                <h3 className="stat-number">850+</h3>
                <p className="stat-label">Verified Tech Companies</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper bg-emerald-50 text-emerald-600">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <h3 className="stat-number">120k+</h3>
                <p className="stat-label">Registered Job Seekers</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper bg-amber-50 text-amber-600">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <h3 className="stat-number">98.4%</h3>
                <p className="stat-label">Candidate Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR JOB CATEGORIES */}
      <section className="section-padding bg-slate-50">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Explore By Domain</span>
            <h2 className="section-title">Popular Job Categories</h2>
            <p className="section-description">
              Find open positions tailored to your specialized skill sets across high-growth disciplines.
            </p>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                role="button"
                tabIndex={0}
              >
                <div className="category-top">
                  <div
                    className="category-icon-box"
                    style={{ backgroundColor: cat.bgColor, color: cat.color }}
                  >
                    <Briefcase size={22} />
                  </div>
                  <span className="category-badge" style={{ color: cat.color, backgroundColor: cat.bgColor }}>
                    {cat.badge}
                  </span>
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-description">{cat.description}</p>
                <div className="category-footer">
                  <span className="category-count">{cat.jobCount.toLocaleString()} Open Roles</span>
                  <ArrowRight size={16} className="category-arrow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-subtitle">Top Opportunities</span>
              <h2 className="section-title">Featured Job Openings</h2>
              <p className="section-description">
                Hand-picked roles from top technology leaders actively interviewing candidates.
              </p>
            </div>
            <Link to="/jobs" className="btn btn-outline view-all-btn">
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>

          <div className="jobs-grid-3">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={(j) => setSelectedJobForApply(j)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-padding bg-slate-50">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Simple 4-Step Process</span>
            <h2 className="section-title">How JobNest Works For You</h2>
            <p className="section-description">
              Streamlining the job hunt from discovery to final job offer with clarity.
            </p>
          </div>

          <div className="how-it-works-grid">
            <div className="how-step-card">
              <div className="step-number-badge">01</div>
              <div className="step-icon-box bg-blue-100 text-blue-600">
                <Search size={24} />
              </div>
              <h3 className="step-title">Explore Open Roles</h3>
              <p className="step-description">
                Filter through thousands of jobs with transparent salary ranges, remote modes, and verified expectations.
              </p>
            </div>

            <div className="how-step-card">
              <div className="step-number-badge">02</div>
              <div className="step-icon-box bg-indigo-100 text-indigo-600">
                <Compass size={24} />
              </div>
              <h3 className="step-title">Save & Shortlist</h3>
              <p className="step-description">
                Bookmark exciting opportunities with one click and compare compensation packages side-by-side.
              </p>
            </div>

            <div className="how-step-card">
              <div className="step-number-badge">03</div>
              <div className="step-icon-box bg-emerald-100 text-emerald-600">
                <FileCheck size={24} />
              </div>
              <h3 className="step-title">Submit Application</h3>
              <p className="step-description">
                Upload your resume, customize a tailored cover note, and submit directly to the hiring team.
              </p>
            </div>

            <div className="how-step-card">
              <div className="step-number-badge">04</div>
              <div className="step-icon-box bg-amber-100 text-amber-600">
                <Award size={24} />
              </div>
              <h3 className="step-title">Track Status & Offer</h3>
              <p className="step-description">
                Monitor real-time updates as recruiters review your profile, schedule interviews, and extend offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RECENTLY POSTED JOBS */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-subtitle">Fresh Openings</span>
              <h2 className="section-title">Recently Posted Vacancies</h2>
              <p className="section-description">
                Be among the first applicants to these freshly listed positions.
              </p>
            </div>
            <Link to="/jobs" className="btn btn-outline view-all-btn">
              Explore All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="jobs-grid-3">
            {recentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={(j) => setSelectedJobForApply(j)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED BY TOP TECH COMPANIES */}
      <section className="section-padding bg-slate-900 text-white">
        <div className="container text-center">
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-2 block">
            Leading Global Employers
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Trusted by World-Renowned Engineering Teams
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Our talent marketplace connects passionate builders with innovators pushing technological boundaries.
          </p>

          <div className="company-logos-row">
            <div className="company-pill-item">Stripe</div>
            <div className="company-pill-item">Vercel</div>
            <div className="company-pill-item">Figma</div>
            <div className="company-pill-item">Spotify</div>
            <div className="company-pill-item">Datadog</div>
            <div className="company-pill-item">Slack</div>
            <div className="company-pill-item">Airbnb</div>
            <div className="company-pill-item">Netflix</div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-left">
              <span className="cta-badge">Ready for your next leap?</span>
              <h2 className="cta-headline">Take The Next Big Step In Your Career</h2>
              <p className="cta-subtext">
                Explore thousands of curated jobs, save positions to your bookmarks, and track your applications seamlessly.
              </p>
              <div className="cta-buttons">
                <Link to="/jobs" className="btn btn-primary btn-lg">
                  Browse All Jobs <ArrowRight size={18} />
                </Link>
                <Link to="/admin" className="btn btn-outline-white btn-lg">
                  Recruiter Admin Hub
                </Link>
              </div>
            </div>
            <div className="cta-stats-box">
              <div className="cta-stat-item">
                <span className="cta-stat-number">100%</span>
                <span className="cta-stat-label">Transparent Salary Bands</span>
              </div>
              <div className="cta-stat-item">
                <span className="cta-stat-number">&lt; 48h</span>
                <span className="cta-stat-label">Average Recruiter Response</span>
              </div>
              <div className="cta-stat-item">
                <span className="cta-stat-number">Free</span>
                <span className="cta-stat-label">For All Job Seekers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Application Modal */}
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
