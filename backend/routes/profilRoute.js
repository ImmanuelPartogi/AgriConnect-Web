import express from "express";
import * as profilController from "../controllers/profilController.js";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get('/', verifyToken, profilController.getProfil);
router.post('/', verifyToken, upload.single('gambar'), profilController.addProfil); 
router.put('/', verifyToken, upload.single('gambar'), profilController.upsertProfil); 
router.delete("/", verifyToken, profilController.deleteProfil);
router.get('/pasar/:userId', verifyToken, profilController.getProfilById); 

export default router;
