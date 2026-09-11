import express from "express";
import { handleChat } from "../controllers/chat.controller.js";

const chatRoutes = express.Router();

chatRoutes.post("/", handleChat);

export default chatRoutes;
