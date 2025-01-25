import express from "express";
import * as edukasiController from "../controllers/edukasiController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("gambar"), edukasiController.addEdukasi);
router.get("/", edukasiController.getEdukasi);
router.get("/:id", edukasiController.getEdukasiById);
router.put("/:id", upload.single("gambar"), edukasiController.updateEdukasi);
router.delete("/:id", edukasiController.deleteEdukasi);
router.get("/jumlah/jumlah-terbaru", edukasiController.getJumlahEdukasi);

export default router;
