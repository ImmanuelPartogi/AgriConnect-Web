import express from "express";
import * as komentarController from "../controllers/komentarController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { cekPemilikKomentarAtauAdmin } from "../middlewares/cekPemilikKomentar.js";

const router = express.Router();

router.get("/thread/:threadId", verifyToken, komentarController.getKomentarByThreadId);
router.post("/thread/:threadId", verifyToken, komentarController.addKomentar);
router.put('/:id', verifyToken, cekPemilikKomentarAtauAdmin, komentarController.updateKomentar);
router.delete('/:id', verifyToken, cekPemilikKomentarAtauAdmin, komentarController.deleteKomentar);

export default router;
