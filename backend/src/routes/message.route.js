import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteMessage, getMessages, getUsersForSidebar, sendMessage, sendMessageToGeminiAi, getHistory } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/history", getHistory)
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.post("/geminiai", protectRoute, sendMessageToGeminiAi)
router.delete("/:id", deleteMessage)

export default router;
