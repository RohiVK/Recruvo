import express from "express";
import { submitFeedback, getFeedbacks } from "../controllers/feedback.controller.js";

const feedbackRoutes = express.Router();

feedbackRoutes.post("/", submitFeedback);
feedbackRoutes.get("/", getFeedbacks);

export default feedbackRoutes;
