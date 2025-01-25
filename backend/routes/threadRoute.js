import express from "express";
import * as threadController from "../controllers/threadController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js"; // Import upload middleware

const router = express.Router();

router.get("/forum/:forumId", verifyToken, threadController.getThreadsByForum);
router.post("/forum/:forumId", verifyToken, upload.single('gambar'), threadController.createThread); // Gunakan upload middleware
router.delete("/:id", verifyToken, threadController.removeThread);
router.put("/:id", verifyToken, upload.single('gambar'), threadController.updateThread); // Gunakan upload middleware

export default router;
