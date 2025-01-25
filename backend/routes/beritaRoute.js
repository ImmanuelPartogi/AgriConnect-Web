import express from "express";
import * as beritaController from "../controllers/beritaController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("gambar"), beritaController.addBerita);
router.put("/:id", upload.single("gambar"), beritaController.updateBerita);
router.delete("/:id", beritaController.deleteBerita);
router.get("/", beritaController.getAllBerita);
router.get("/:id", beritaController.getBeritaById);

export default router;
