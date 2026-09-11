import express from "express";
import { upload } from "../controllers/resume.controller.js";
import {
  createJobDescription,
  createJobDescriptionFromFile,
  getJobDescriptions,
  getJobDescription,
  updateJobDescription,
  deleteJobDescription,
} from "../controllers/job_description.controller.js";

const jobDescriptionRoutes = express.Router();

jobDescriptionRoutes.post("/", upload.single("file"), createJobDescription);
jobDescriptionRoutes.post("/upload", upload.single("file"), createJobDescriptionFromFile);
jobDescriptionRoutes.get("/", getJobDescriptions);
jobDescriptionRoutes.get("/:id", getJobDescription);
jobDescriptionRoutes.put("/:id", updateJobDescription);
jobDescriptionRoutes.delete("/:id", deleteJobDescription);

export default jobDescriptionRoutes;