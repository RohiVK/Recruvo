import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { RecruvoProvider } from "./context/RecruvoContext";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import UploadJD from "./pages/UploadJD";
import UploadResumes from "./pages/UploadResumes";
import Analysis from "./pages/Analysis";
import CandidateAnalysis from "./pages/CandidateAnalysis";
import CompareCandidates from "./pages/CompareCandidates";
import ExportResults from "./pages/ExportResults";
import Settings from "./pages/Settings";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <RecruvoProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
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
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </RecruvoProvider>
  );
}

export default App;