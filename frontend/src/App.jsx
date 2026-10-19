import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { RecruvoProvider } from "./context/RecruvoContext";
import AppShell from "./components/layout/AppShell";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { SkeletonPageLoader } from "./components/ui/Skeleton";

// Lazy-loaded pages with Suspense skeletal loading
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
          <AppShell>
            <Suspense fallback={<SkeletonPageLoader />}>
              <Routes>
                {/* Core App Routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/upload-jd" element={<UploadJD />} />
                <Route path="/upload-resumes" element={<UploadResumes />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/analysis/:id" element={<CandidateAnalysis />} />
                <Route path="/candidates/:id" element={<CandidateAnalysis />} />
                <Route path="/compare" element={<CompareCandidates />} />
                <Route path="/export" element={<ExportResults />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/feedback" element={<Feedback />} />

                {/* Legacy route redirects to prevent accidental bouncing or 404 bugs */}
                <Route path="/jobs" element={<Navigate to="/upload-jd" replace />} />
                <Route path="/jobs/*" element={<Navigate to="/upload-jd" replace />} />
                <Route path="/resumes" element={<Navigate to="/upload-resumes" replace />} />
                <Route path="/screenings" element={<Navigate to="/analysis" replace />} />
                <Route path="/screenings/:id" element={<Navigate to="/analysis" replace />} />
                <Route path="/candidates" element={<Navigate to="/analysis" replace />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AppShell>
        </BrowserRouter>
      </ErrorBoundary>
    </RecruvoProvider>
  );
}

export default App;