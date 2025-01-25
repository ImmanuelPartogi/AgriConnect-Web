import express from "express";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";
import {
  getAllForum,
  getForumById,
  addForum,
  updateForum,
  deleteForum,
} from "../controllers/forumController.js";

const router = express.Router();

router.get("/", verifyToken, getAllForum);
router.get("/:id", verifyToken, getForumById);
router.post("/", verifyToken, addForum);
router.put("/:id", verifyToken, updateForum);
router.delete("/:id", verifyToken, deleteForum);

export default router;
