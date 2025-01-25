import express from "express";
import * as grupChatController from "../controllers/grupChatController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

router.post("/:grup_id", verifyToken, grupChatController.sendPesanToGrup);
router.get("/:grup_id", verifyToken, grupChatController.getPesanFromGrup);
router.delete("/:grup_id/pesan/:pesan_id", verifyToken, grupChatController.deletePesanFromGrupChat);


export default router;
