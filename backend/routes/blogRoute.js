import express from "express";
import * as blogController from "../controllers/blogController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; 
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, upload.single('gambar'), blogController.addBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", upload.single('gambar'), verifyToken, blogController.updateBlog);
router.delete("/:id", verifyToken, blogController.deleteBlog);

export default router;
