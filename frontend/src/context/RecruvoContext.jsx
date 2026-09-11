import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as jobsApi from "../api/jobs";
import * as resumesApi from "../api/resumes";
import * as screeningsApi from "../api/screenings";
import * as chatApi from "../api/chat";
import * as feedbackApi from "../api/feedback";

const RecruvoContext = createContext(null);

export function RecruvoProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJobState] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("checking"); // checking | online | offline
  const [chatConversations, setChatConversations] = useState({}); // key: candidateId or 'comp-X-Y'
  const [recentActivities, setRecentActivities] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recruvo_recent_activities") || "[]");
    } catch {
      return [];
    }
  });

  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem("recruvo_theme") || "classic";
    } catch {
      return "classic";
    }
  });

  const setTheme = useCallback((newTheme) => {
    const validTheme = newTheme === "genz" ? "genz" : "classic";
    setThemeState(validTheme);
    try {
      localStorage.setItem("recruvo_theme", validTheme);
    } catch (e) {
      console.warn("Theme storage error:", e);
    }
    document.documentElement.setAttribute("data-theme", validTheme);
    if (validTheme === "genz") {
      document.documentElement.classList.add("theme-genz");
      document.documentElement.classList.remove("theme-classic");
    } else {
      document.documentElement.classList.add("theme-classic");
      document.documentElement.classList.remove("theme-genz");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "classic" ? "genz" : "classic");
  }, [theme, setTheme]);

  useEffect(() => {
    // Initial sync
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "genz") {
      document.documentElement.classList.add("theme-genz");
      document.documentElement.classList.remove("theme-classic");
    } else {
      document.documentElement.classList.add("theme-classic");
      document.documentElement.classList.remove("theme-genz");
    }
  }, [theme]);

  const addActivity = useCallback((text, type = "info") => {
    const activity = {
      id: Date.now(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setRecentActivities((prev) => {
      const updated = [activity, ...prev.slice(0, 19)];
      localStorage.setItem("recruvo_recent_activities", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Set active job and persist id
  const setActiveJob = useCallback((job) => {
    setActiveJobState(job);
    if (job?.id) {
      localStorage.setItem("recruvo_active_job_id", String(job.id));
      addActivity(`Selected active job: ${job.job_description?.title || "Job #" + job.id}`);
    } else {
      localStorage.removeItem("recruvo_active_job_id");
    }
  }, [addActivity]);

  // Refresh all state from backend
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [jobsRes, resumesRes] = await Promise.allSettled([
        jobsApi.getJobDescriptions(),
        resumesApi.getResumes(),
      ]);

      let loadedJobs = [];
      if (jobsRes.status === "fulfilled" && jobsRes.value?.jobs) {
        loadedJobs = jobsRes.value.jobs;
        setJobs(loadedJobs);
      }

      let loadedCandidates = [];
      if (resumesRes.status === "fulfilled" && resumesRes.value?.resumes) {
        loadedCandidates = resumesRes.value.resumes;
        setCandidates(loadedCandidates);
      }

      // Restore active job if present
      const savedJobId = localStorage.getItem("recruvo_active_job_id");
      let currentActive = null;
      if (savedJobId && loadedJobs.length > 0) {
        currentActive = loadedJobs.find((j) => String(j.id) === String(savedJobId)) || loadedJobs[0];
      } else if (loadedJobs.length > 0) {
        currentActive = loadedJobs[0];
      }
      setActiveJobState(currentActive);

      // Load screenings for active job if exists
      if (currentActive?.id) {
        try {
          const screeningsRes = await screeningsApi.getScreenings({ jdId: currentActive.id });
          if (screeningsRes?.screenings) {
            setScreenings(screeningsRes.screenings);
          }
        } catch (e) {
          console.warn("Failed to load screenings for active job:", e);
        }
      }

      setBackendStatus("online");
    } catch (err) {
      console.error("Failed to load Recruvo data:", err);
      setBackendStatus("offline");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reload screenings whenever activeJob changes
  useEffect(() => {
    if (activeJob?.id) {
      screeningsApi
        .getScreenings({ jdId: activeJob.id })
        .then((res) => {
          if (res?.screenings) setScreenings(res.screenings);
        })
        .catch((e) => console.warn("Failed to load screenings:", e));
    }
  }, [activeJob?.id]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Upload JD from text
  const uploadJobText = async (text) => {
    const res = await jobsApi.createJobDescription(text);
    if (res?.job) {
      setJobs((prev) => [res.job, ...prev]);
      setActiveJob(res.job);
      addActivity(`Created job description: ${res.job.job_description?.title || "New Job"}`, "job");
      return res.job;
    }
    throw new Error("Failed to create job description");
  };

  // Upload JD from file
  const uploadJobFile = async (file) => {
    const res = await jobsApi.uploadJobDescriptionFile(file);
    if (res?.job) {
      setJobs((prev) => [res.job, ...prev]);
      setActiveJob(res.job);
      addActivity(`Uploaded job description from file: ${file.name}`, "job");
      return res.job;
    }
    throw new Error("Failed to upload job description file");
  };

  // Upload Resumes batch
  const uploadResumesBatch = async (files) => {
    const res = await resumesApi.uploadResumes(files);
    if (res?.resumes) {
      const successful = res.resumes.filter((r) => !r.ignored && r.resume).map((r) => r.resume);
      if (successful.length > 0) {
        setCandidates((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newOnes = successful.filter((s) => !existingIds.has(s.id));
          return [...newOnes, ...prev];
        });
        addActivity(`Uploaded ${successful.length} candidate resume(s)`, "resume");
      }
      return res.resumes;
    }
    throw new Error("Failed to upload resumes");
  };

  // Run screening for single candidate
  const runScreening = async (resumeId, jdId = activeJob?.id) => {
    if (!jdId) throw new Error("No active job description selected");
    const res = await screeningsApi.createScreening(resumeId, jdId);
    if (res?.screening) {
      setScreenings((prev) => {
        const filtered = prev.filter(
          (s) => !(s.resume_id === resumeId && String(s.jd_id) === String(jdId))
        );
        return [res.screening, ...filtered];
      });
      return res.screening;
    }
    throw new Error("Failed to screen resume");
  };

  // Run batch screening with callback for progress
  const runBatchScreening = async (candidateList = candidates, onProgress) => {
    if (!activeJob?.id) throw new Error("Please select or upload an Active Job Description first.");
    const results = [];
    for (let i = 0; i < candidateList.length; i++) {
      const cand = candidateList[i];
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: candidateList.length,
          candidate: cand,
          status: "processing",
        });
      }
      try {
        const screening = await runScreening(cand.id, activeJob.id);
        results.push({ candidate: cand, screening, success: true });
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: candidateList.length,
            candidate: cand,
            screening,
            status: "success",
          });
        }
      } catch (err) {
        console.error(`Screening failed for candidate #${cand.id}:`, err);
        results.push({ candidate: cand, error: err.message, success: false });
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: candidateList.length,
            candidate: cand,
            error: err.message,
            status: "error",
          });
        }
      }
    }
    addActivity(`Completed screening analysis for ${candidateList.length} candidate(s)`, "analysis");
    return results;
  };

  // Send Contextual Chat
  const sendChat = async ({ message, context = {} }) => {
    const sessionKey = context.comparisonCandidateId
      ? `comp-${context.candidateId}-${context.comparisonCandidateId}`
      : `cand-${context.candidateId || "general"}`;

    const existingConversation = chatConversations[sessionKey] || [];
    const updatedConversation = [...existingConversation, { role: "user", content: message }];

    setChatConversations((prev) => ({
      ...prev,
      [sessionKey]: updatedConversation,
    }));

    try {
      const res = await chatApi.sendChatMessage({
        message,
        context: {
          jobId: context.jobId || activeJob?.id,
          candidateId: context.candidateId,
          comparisonCandidateId: context.comparisonCandidateId,
        },
        conversation: updatedConversation,
      });

      const reply = res.response || "No response received.";
      const finalConversation = [...updatedConversation, { role: "assistant", content: reply }];

      setChatConversations((prev) => ({
        ...prev,
        [sessionKey]: finalConversation,
      }));

      return reply;
    } catch (err) {
      console.warn("Chat API error, providing local decision response:", err);
      const fallbackReply = `I am Recruvo AI. I am ready to assist you. Please upload or select a candidate to evaluate match scores, strengths, and missing skills.`;
      const finalConversation = [...updatedConversation, { role: "assistant", content: fallbackReply }];
      setChatConversations((prev) => ({
        ...prev,
        [sessionKey]: finalConversation,
      }));
      return fallbackReply;
    }
  };

  const getChatHistory = (sessionKey) => chatConversations[sessionKey] || [];

  const clearChatHistory = (sessionKey) => {
    setChatConversations((prev) => ({
      ...prev,
      [sessionKey]: [],
    }));
  };

  // Submit Feedback
  const submitFeedback = async ({ rating, type, message }) => {
    const res = await feedbackApi.submitFeedback({ rating, type, message });
    addActivity(`Submitted ${type === "bug" ? "bug report" : "feedback"}`, "feedback");
    return res;
  };

  // Update Job Description
  const updateJob = async (id, updatedData) => {
    const res = await jobsApi.updateJobDescription(id, updatedData);
    if (res?.job) {
      setJobs((prev) => prev.map((j) => (String(j.id) === String(id) ? res.job : j)));
      if (activeJob && String(activeJob.id) === String(id)) {
        setActiveJobState(res.job);
      }
      addActivity(`Updated job description: ${res.job.job_description?.title || "Job #" + id}`, "job");
      return res.job;
    }
    throw new Error("Failed to update job description");
  };

  // Delete Job Description
  const deleteJob = async (id) => {
    await jobsApi.deleteJobDescription(id);
    setJobs((prev) => prev.filter((j) => String(j.id) !== String(id)));
    setScreenings((prev) => prev.filter((s) => String(s.jd_id) !== String(id)));
    if (activeJob && String(activeJob.id) === String(id)) {
      const remaining = jobs.filter((j) => String(j.id) !== String(id));
      setActiveJob(remaining.length > 0 ? remaining[0] : null);
    }
    addActivity(`Deleted job description #${id}`, "job");
  };

  // Delete Candidate Resume
  const deleteResume = async (id) => {
    await resumesApi.deleteResume(id);
    setCandidates((prev) => prev.filter((c) => String(c.id) !== String(id)));
    setScreenings((prev) => prev.filter((s) => String(s.resume_id) !== String(id)));
    addActivity(`Deleted candidate resume #${id}`, "resume");
  };

  // Clear Session & Cache
  const clearCache = () => {
    try {
      localStorage.removeItem("recruvo_active_job_id");
      localStorage.removeItem("recruvo_recent_activities");
      localStorage.removeItem("recruvo_chat_conversations");
    } catch (e) {
      console.warn("Storage clear warning:", e);
    }
    setActiveJobState(null);
    setScreenings([]);
    setChatConversations({});
    setRecentActivities([]);
    refreshData();
    return true;
  };

  const clearSessionData = clearCache;

  const value = {
    theme,
    setTheme,
    toggleTheme,
    jobs,
    activeJob,
    setActiveJob,
    candidates,
    screenings,
    isLoading,
    backendStatus,
    recentActivities,
    refreshData,
    uploadJobText,
    uploadJobFile,
    updateJob,
    deleteJob,
    uploadResumesBatch,
    deleteResume,
    runScreening,
    runBatchScreening,
    sendChat,
    getChatHistory,
    clearChatHistory,
    submitFeedback,
    clearCache,
    clearSessionData,
    addActivity,
  };

  return <RecruvoContext.Provider value={value}>{children}</RecruvoContext.Provider>;
}

export function useRecruvo() {
  const context = useContext(RecruvoContext);
  if (!context) {
    throw new Error("useRecruvo must be used within a RecruvoProvider");
  }
  return context;
}
