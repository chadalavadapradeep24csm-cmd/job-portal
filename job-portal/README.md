# JobNest — Modern Job Listing Portal 🚀

A complete, modern, responsive, and fully functional **Job Listing Portal** built as an individual college project demonstration using **HTML5, CSS3, React.js, JavaScript ES6+, Vite, and browser LocalStorage**.

---

## 🌟 Key Highlights & Objectives Achieved

1. **Modern Recruitment Platform Design**:
   - Clean white background accented with deep navy blue (`#0f172a`, `#0a1128`) and bright blue (`#2563eb`).
   - Clean Inter typography, rounded cards, subtle shadows, badge tags, and micro-interactions.
   - Fully responsive on Desktop, Tablet, and Mobile devices (including mobile drawer navigation and mobile filter drawer).

2. **Complete Frontend Functionality (Zero Broken Buttons)**:
   - **Hero Search Bar**: Multi-field search (Keyword, Location, Category) that immediately routes to filtered results.
   - **Find Jobs Page**: Search by title/company/skills, filter by Category, Location, Job Type (Full-time, Part-time, Contract, Internship), Work Mode (Remote, Hybrid, On-site), Experience Level, and Salary slider.
   - **List & Grid View**: Toggle between responsive grid cards and compact list layouts.
   - **Job Details View (`/jobs/:id`)**: Role overview, responsibilities, requirements, interactive skill pills, perks & benefits, company metadata, and similar opportunities.
   - **Save & Bookmark System**: Toggle save/bookmark with real-time counter badges in the navbar and persistent storage in `localStorage`.
   - **Job Application Modal**: Realistic application submission with contact fields, experience selector, simulated resume upload (.pdf, .docx with file size validation), cover letter, and toast feedback.
   - **Application Status Tracker (`/applications`)**: Real-time status pipeline (*Under Review*, *Shortlisted*, *Interview Scheduled*, *Offer Received*, *Rejected*) and application withdrawal capability.
   - **Admin Hub & Recruiter Dashboard (`/admin`)**:
     - KPI cards (Active listings, candidate applications count, interviews, featured roles).
     - Full CRUD: Post new vacancy, edit existing job, delete job, or reset to initial 16 seed jobs.
     - Review candidate submissions per job and update application status in real-time!
   - **Simulated Authentication (`/login`)**:
     - 1-click demo login as **Alex Morgan (Job Seeker)** or **Sarah Chen (Recruiter & Admin)**.
     - Instant role switcher pill in the top demo banner for live college viva demonstrations.

3. **Data Persistence**:
   - Seeded with 16 realistic tech jobs from companies like Stripe, Vercel, Figma, Spotify, Datadog, Slack, Microsoft, Canva, Netflix, Google, and Airbnb.
   - Changes (new jobs, edited jobs, deleted jobs, bookmarks, applications, application statuses) persist across page reloads in `localStorage`.
   - "Reset Seed Data" button allows quick restore back to the default dataset at any time.

---

## 🛠️ Technology Stack

- **Frontend Core**: HTML5, CSS3 (Vanilla CSS with design tokens & variables), React 18, JavaScript ES6+
- **Bundler & Dev Server**: Vite 5
- **Routing**: Client-Side React Router (BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams, useSearchParams)
- **Icons**: Lucide React
- **State Management**: React Context API (`JobContext`, `AuthContext`, `ApplicationContext`, `ToastContext`)
- **Data Persistence**: Browser `localStorage` (No external database or server needed)

---

## 📁 Project Structure

```
d:/job portal/
├── index.html                   # HTML entry point with Inter font & metadata
├── vite.config.js               # Vite configuration and path aliases
├── package.json                 # Dependencies and npm scripts
├── public/
│   └── favicon.svg              # Brand icon
├── src/
│   ├── main.jsx                 # React root renderer
│   ├── App.jsx                  # Main application with routes & providers
│   ├── index.css                # Complete CSS design system & responsive styling
│   ├── router/
│   │   └── index.jsx            # React Router implementation
│   ├── data/
│   │   ├── jobs.json            # 16 realistic initial job listings
│   │   └── categories.js        # Category data, locations, and filter values
│   ├── context/
│   │   ├── JobContext.jsx       # Jobs state, localStorage sync, CRUD operations
│   │   ├── AuthContext.jsx      # Simulated authentication & demo role switcher
│   │   ├── ApplicationContext.jsx # Candidate applications & status tracking
│   │   └── ToastContext.jsx     # Modern stacked toast notifications
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx       # Sticky responsive navbar with counter badges
│   │   │   ├── Footer.jsx       # Multi-column footer with academic disclaimer
│   │   │   ├── Modal.jsx        # Accessible reusable modal dialog
│   │   │   ├── Badge.jsx        # Pill tags (Remote, Full-time, status, etc.)
│   │   │   ├── CompanyAvatar.jsx# Initialized monogram badges with brand colors
│   │   │   └── CollegeProjectBanner.jsx # Top banner with role switch & viva help
│   │   ├── jobs/
│   │   │   ├── JobCard.jsx      # Reusable job card (Grid/List, Save, Apply)
│   │   │   ├── JobFilters.jsx   # Multi-faceted sidebar filter panel
│   │   │   ├── JobSearchHero.jsx# Hero 3-field search bar
│   │   │   └── JobApplicationModal.jsx # Full application form with file upload
│   │   └── admin/
│   │       ├── JobFormModal.jsx # Add & Edit job modal form
│   │       └── ApplicantStatusModal.jsx # Recruiter review & status updater
│   └── pages/
│       ├── HomePage.jsx         # Landing page (Hero, Stats, Categories, Featured)
│       ├── FindJobsPage.jsx     # Search & Filter with Grid/List view & Pagination
│       ├── JobDetailPage.jsx    # Complete job overview & company profile
│       ├── SavedJobsPage.jsx    # Bookmarked jobs management
│       ├── MyApplicationsPage.jsx # Application tracking with real-time status
│       ├── AdminDashboardPage.jsx # Recruiter CRUD management & applicant reviews
│       ├── LoginPage.jsx        # 1-Click demo accounts & profile view
│       └── NotFoundPage.jsx     # 404 handler
```

---

## 🚀 How to Run Locally

1. Open a terminal in the project directory:
   ```bash
   cd "d:\job portal"
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

4. To build for production:
   ```bash
   npm run build
   ```

---

## 🎓 College Viva Demonstration Guide

During your presentation or viva examination, follow this suggested flow to showcase the project:

1. **Landing Page (`/`)**:
   - Show the modern hero section, statistics counter, and popular job categories.
   - Point out the responsive navbar with dynamic badges for saved jobs and applications.
   - Type `"React"` in the hero search bar and click **"Find Jobs"**.

2. **Search & Multi-Filtering (`/jobs`)**:
   - Demonstrate multi-criteria filtering: select **Category** (*Software Engineering*), **Work Mode** (*Remote*), and move the **Min Salary slider**.
   - Show the active filter pill tags with one-click remove and the **Grid / List view toggle**.

3. **Job Details & Application (`/jobs/job-1`)**:
   - Click into a job listing to view the comprehensive description, responsibilities, requirements, tech skills, and company profile.
   - Click **"Apply Now"** to open the modal. Show the pre-filled applicant details, simulate attaching a resume file, and submit.
   - Notice the toast confirmation and how the button instantly updates to **"Applied ✓"**.

4. **Saved Jobs & Applications Tracking (`/saved-jobs` & `/applications`)**:
   - Show how the saved jobs list displays all bookmarked positions.
   - Open **"My Applications"** to show the submitted application tracked under **"Under Review"**.

5. **Admin Hub & Cross-Role Synchronization (`/admin`)**:
   - Use the top **Viva Demo Banner** to click **"Switch to Admin Mode"**.
   - Navigate to the **Admin Hub**:
     - Show the KPI stats.
     - Click **"Post New Vacancy"** to create a custom job and show it instantly appear in the directory.
     - Switch to the **"Candidate Submissions"** tab to see the application submitted earlier.
     - Click **"Review & Update"** to change the candidate's status to **"Interview Scheduled"**.
   - Switch back to **Job Seeker Mode**, visit **"My Applications"**, and show the status updated dynamically to **"Interview Scheduled"**!
