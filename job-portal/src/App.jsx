import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { ApplicationProvider } from './context/ApplicationContext';

import CollegeProjectBanner from './components/common/CollegeProjectBanner';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import HomePage from './pages/HomePage';
import FindJobsPage from './pages/FindJobsPage';
import JobDetailPage from './pages/JobDetailPage';
import SavedJobsPage from './pages/SavedJobsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <JobProvider>
          <ApplicationProvider>
            <BrowserRouter>
              <div className="app-layout">
                {/* Academic viva demo banner */}
                <CollegeProjectBanner />

                {/* Main Navigation */}
                <Navbar />

                {/* App Routes */}
                <div className="main-content-area">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/jobs" element={<FindJobsPage />} />
                    <Route path="/jobs/:id" element={<JobDetailPage />} />
                    <Route path="/saved-jobs" element={<SavedJobsPage />} />
                    <Route path="/applications" element={<MyApplicationsPage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>

                {/* Footer */}
                <Footer />
              </div>
            </BrowserRouter>
          </ApplicationProvider>
        </JobProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
