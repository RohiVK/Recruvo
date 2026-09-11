import express from "express";
import { getSettings, updateGeminiKey } from "../controllers/settings.controller.js";

const settingsRoutes = express.Router();

settingsRoutes.get("/", getSettings);
settingsRoutes.post("/gemini-key", updateGeminiKey);

export default settingsRoutes;
