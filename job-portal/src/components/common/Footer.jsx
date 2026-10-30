import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, MapPin, Phone, Heart, Award, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="portal-footer">
      <div className="footer-top container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col footer-brand-col">
            <Link to="/" className="navbar-logo footer-logo">
              <div className="logo-icon-box">
                <Briefcase size={22} className="logo-icon" />
              </div>
              <div className="logo-text-wrapper">
                <span className="logo-title text-white">Job<span className="logo-accent">Nest</span></span>
                <span className="logo-tagline text-slate-400">Career Opportunities</span>
              </div>
            </Link>
            <p className="footer-description">
              JobNest is a next-generation job discovery and recruitment platform connecting ambitious candidates with world-class engineering, design, and product opportunities.
            </p>
            <div className="footer-contact-items">
              <div className="contact-item">
                <MapPin size={15} />
                <span>San Francisco, CA & Global Remote</span>
              </div>
              <div className="contact-item">
                <Mail size={15} />
                <span>support@jobnest-portal.demo</span>
              </div>
              <div className="contact-item">
                <Phone size={15} />
                <span>+1 (800) 555-NEST</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Job Seekers</h4>
            <ul className="footer-links">
              <li><Link to="/jobs">Explore All Jobs</Link></li>
              <li><Link to="/jobs?workMode=Remote">Remote Opportunities</Link></li>
              <li><Link to="/saved-jobs">Saved Bookmarks</Link></li>
              <li><Link to="/applications">Application Status Tracker</Link></li>
              <li><Link to="/login">Seeker Profile & Demo Login</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Top Categories</h4>
            <ul className="footer-links">
              <li><Link to="/jobs?category=Software+Engineering">Software Engineering</Link></li>
              <li><Link to="/jobs?category=UI%2FUX+Design">UI/UX Design</Link></li>
              <li><Link to="/jobs?category=Data+%26+AI">Data & Artificial Intelligence</Link></li>
              <li><Link to="/jobs?category=DevOps+%26+Cloud">DevOps & Cloud Systems</Link></li>
              <li><Link to="/jobs?category=Product+Management">Product Management</Link></li>
            </ul>
          </div>

          {/* Recruiters & Academic Notice */}
          <div className="footer-col">
            <h4 className="footer-heading">Recruiters & Academic</h4>
            <ul className="footer-links">
              <li><Link to="/admin">Recruiter Admin Dashboard</Link></li>
              <li><Link to="/admin">Post New Vacancy</Link></li>
              <li><Link to="/admin">Review Candidate Submissions</Link></li>
            </ul>
            <div className="academic-badge-card">
              <div className="flex items-center gap-2 mb-1">
                <Award size={16} className="text-blue-400" />
                <span className="font-semibold text-xs text-white">College Project</span>
              </div>
              <p className="text-xs text-slate-300 m-0">
                Crafted using React.js, Vanilla CSS3, Vite, and localStorage dummy database for final year demonstration & viva.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">
            &copy; 2026 <strong>JobNest</strong> — Job Listing Portal. All simulated rights reserved. Built with <Heart size={13} className="text-red-500 inline mx-1" /> for Academic Demonstration.
          </p>
          <div className="footer-bottom-links">
            <span className="privacy-badge">Client-Side LocalStorage Persistence</span>
            <span className="privacy-badge">No External Backend Needed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
