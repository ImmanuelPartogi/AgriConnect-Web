import express from "express";
import * as anggotaGrupController from "../controllers/anggotaGrupController.js";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

router.post("/:grup_id", verifyToken, anggotaGrupController.addAnggotaToGrup);
router.get("/:grup_id", verifyToken, anggotaGrupController.getAnggotaFromGrup);
router.delete("/:grup_id", verifyToken, anggotaGrupController.deleteAnggotaFromGrup);

export default router;
