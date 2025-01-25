import express from "express";
import * as pasarController from "../controllers/pasarController.js";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, checkRole(['admin', 'petani']), upload.single('gambar'), pasarController.addPasar);
router.get("/", pasarController.getPasar);
router.get("/:id", pasarController.getPasarById);
router.put("/:id", verifyToken, checkRole(['admin', 'petani']), upload.single('gambar'), pasarController.updatePasar);
router.delete("/:id", verifyToken, checkRole(['admin', 'petani']), pasarController.deletePasar);
export default router;
