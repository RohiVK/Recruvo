import fs from "fs";
import path from "path";
import { getAiClient, isGeminiKeyConfigured } from "../config/gemini.js";

export async function getSettings(req, res) {
  try {
    const isConfigured = isGeminiKeyConfigured();
    const key = process.env.GEMINI_API_KEY || "";
    const maskedKey = isConfigured
      ? `${key.slice(0, 4)}••••••••••••••••${key.slice(-4)}`
      : "";

    let geminiStatus = "not_configured";
    if (isConfigured) {
      try {
        const ai = getAiClient();
        await ai.models.get({ model: "gemini-3.6-flash" });
        geminiStatus = "valid";
      } catch (err) {
        geminiStatus = "invalid_or_quota";
      }
    }

    return res.status(200).json({
      isConfigured,
      maskedKey,
      geminiStatus,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch settings",
    });
  }
}

export async function updateGeminiKey(req, res) {
  try {
    const { apiKey } = req.body;

    if (!apiKey || typeof apiKey !== "string") {
      return res.status(400).json({
        error: "Valid API key string is required",
      });
    }

    const trimmedKey = apiKey.trim();

    // Verify key with a lightweight call to Gemini
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const testAi = new GoogleGenAI({ apiKey: trimmedKey });
      await testAi.models.get({ model: "gemini-3.6-flash" });
    } catch (testErr) {
      console.warn("Gemini key validation warning:", testErr.message);
      if (testErr.message.includes("403") || testErr.message.includes("PERMISSION_DENIED") || testErr.message.includes("API_KEY_INVALID")) {
        return res.status(400).json({
          error: "The provided Gemini API Key was rejected by Google (Invalid key or permission denied). Please check your key from Google AI Studio.",
        });
      }
    }

    // Set in runtime env
    process.env.GEMINI_API_KEY = trimmedKey;

    // Update .env file on disk
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      let envContent = "";
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
      }

      if (envContent.includes("GEMINI_API_KEY=")) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY=${trimmedKey}`);
      } else {
        envContent += `\nGEMINI_API_KEY=${trimmedKey}\n`;
      }

      fs.writeFileSync(envPath, envContent, "utf-8");
    } catch (writeErr) {
      console.warn("Could not persist to .env file:", writeErr.message);
    }

    return res.status(200).json({
      message: "Gemini API Key configured and verified successfully!",
      isConfigured: true,
      maskedKey: `${trimmedKey.slice(0, 4)}••••••••••••••••${trimmedKey.slice(-4)}`,
    });
  } catch (error) {
    console.error("Failed to update API key:", error);
    return res.status(500).json({
      error: error.message || "Failed to save API key",
    });
  }
}
