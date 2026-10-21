import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { RecruvoProvider } from "./context/RecruvoContext";
import AppShell from "./components/layout/AppShell";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { SkeletonPageLoader } from "./components/ui/Skeleton";

// Public Landing Page
const LandingPage = lazy(() => import("./pages/LandingPage"));

// Lazy-loaded workspace pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UploadJD = lazy(() => import("./pages/UploadJD"));
const UploadResumes = lazy(() => import("./pages/UploadResumes"));
const Analysis = lazy(() => import("./pages/Analysis"));
const CandidateAnalysis = lazy(() => import("./pages/CandidateAnalysis"));
const CompareCandidates = lazy(() => import("./pages/CompareCandidates"));
const ExportResults = lazy(() => import("./pages/ExportResults"));
const Settings = lazy(() => import("./pages/Settings"));
const Feedback = lazy(() => import("./pages/Feedback"));

function App() {
  return (
    <RecruvoProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<SkeletonPageLoader />}>
            <Routes>
              {/* Public SaaS Landing Page & Fake Auth Modal */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LandingPage />} />

              {/* Recruiter Workspace Protected Shell */}
              <Route
                path="/dashboard"
                element={
                  <AppShell>
                    <Dashboard />
                  </AppShell>
                }
              />
              <Route
                path="/upload-jd"
                element={
                  <AppShell>
                    <UploadJD />
                  </AppShell>
                }
              />
              <Route
                path="/upload-resumes"
                element={
                  <AppShell>
                    <UploadResumes />
                  </AppShell>
                }
              />
              <Route
                path="/analysis"
                element={
                  <AppShell>
                    <Analysis />
                  </AppShell>
                }
              />
              <Route
                path="/analysis/:id"
                element={
                  <AppShell>
                    <CandidateAnalysis />
                  </AppShell>
                }
              />
              <Route
                path="/candidates/:id"
                element={
                  <AppShell>
                    <CandidateAnalysis />
                  </AppShell>
                }
              />
              <Route
                path="/compare"
                element={
                  <AppShell>
                    <CompareCandidates />
                  </AppShell>
                }
              />
              <Route
                path="/export"
                element={
                  <AppShell>
                    <ExportResults />
                  </AppShell>
                }
              />
              <Route
                path="/settings"
                element={
                  <AppShell>
                    <Settings />
                  </AppShell>
                }
              />
              <Route
                path="/feedback"
                element={
                  <AppShell>
                    <Feedback />
                  </AppShell>
                }
              />

              {/* Route redirects */}
              <Route path="/jobs" element={<Navigate to="/upload-jd" replace />} />
              <Route path="/jobs/*" element={<Navigate to="/upload-jd" replace />} />
              <Route path="/resumes" element={<Navigate to="/upload-resumes" replace />} />
              <Route path="/screenings" element={<Navigate to="/analysis" replace />} />
              <Route path="/screenings/:id" element={<Navigate to="/analysis" replace />} />
              <Route path="/candidates" element={<Navigate to="/analysis" replace />} />

              {/* Fallback to Landing Page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </RecruvoProvider>
  );
}

export default App;