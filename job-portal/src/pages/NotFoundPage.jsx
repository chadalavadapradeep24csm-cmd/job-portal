import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Briefcase } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container section-padding text-center">
      <div className="empty-state-card max-w-lg mx-auto">
        <div className="empty-state-icon bg-blue-50 text-blue-600">
          <Compass size={40} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2 mb-2">404 - Page Not Found</h1>
        <p className="text-slate-600 mb-4">
          The page you are looking for does not exist or has been moved to a new URL.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn btn-outline">
            <ArrowLeft size={16} /> Return to Home
          </Link>
          <Link to="/jobs" className="btn btn-primary">
            <Briefcase size={16} /> Browse All Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
