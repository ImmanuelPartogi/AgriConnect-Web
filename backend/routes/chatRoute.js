import express from "express";
import * as chatController from "../controllers/chatController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";  

const router = express.Router();

router.post("/kirim", verifyToken, chatController.sendPesan);
router.get("/:penerima_id", verifyToken, chatController.getPesan);
router.delete("/:id", verifyToken, chatController.deletePesan);
router.get("/pengguna/chat", verifyToken, chatController.getInteractedUsers);

export default router;
