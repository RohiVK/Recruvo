import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resume.routes.js";
import jobDescriptionRoutes from "./routes/job_description.routes.js";
import screeningRoutes from "./routes/screening.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import db from "./config/db.js";
import { getAiClient, isGeminiKeyConfigured } from "./config/gemini.js";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  const checks = {
    server: { status: "ok" },
    database: { status: "error" },
    gemini: { status: "not_configured" },
  };

  try {
    await db.query("SELECT 1");
    checks.database = { status: "ok" };
  } catch (err) {
    checks.database = { status: "error", message: err.message };
  }

  if (isGeminiKeyConfigured()) {
    try {
      const ai = getAiClient();
      await ai.models.get({ model: "gemini-3.6-flash" });
      checks.gemini = { status: "ok" };
    } catch (err) {
      checks.gemini = {
        status: "error",
        message: err.message || "Gemini authentication failed",
      };
    }
  } else {
    checks.gemini = {
      status: "pending_key",
      message: "GEMINI_API_KEY not configured in backend/.env. Using grounded algorithm fallback until key is added.",
    };
  }

  const healthy = checks.server.status === "ok" && checks.database.status === "ok";

  return res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    checks,
  });
});

app.use("/api/resumes", resumeRoutes);
app.use("/api/job-descriptions", jobDescriptionRoutes);
app.use("/api/screenings", screeningRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Recruvo Backend running on port ${PORT}`);
});