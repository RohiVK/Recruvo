import { BrowserRouter, Routes, Route } from "react-router";
import Overview from "./pages/Overview";
import Candidates from "./pages/Candidates";
import CandidateDetails from "./pages/CandidateDetails";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Screenings from "./pages/Screenings";
import ScreeningDetails from "./pages/ScreeningDetails";
import AppShell from "./components/layout/AppShell";

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidates/:id" element={<CandidateDetails />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/screenings" element={<Screenings />} />
          <Route path="/screenings/:id" element={<ScreeningDetails />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;