import express from "express";
import * as grupPenggunaController from "../controllers/grupPenggunaController.js";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, checkRole(['admin']), grupPenggunaController.addGrupPengguna); 
router.get("/", verifyToken, checkRole(['admin']), grupPenggunaController.getAllGrupPengguna);  
router.put("/:id", verifyToken, checkRole(['admin']), grupPenggunaController.updateGrupPengguna);
router.delete("/:id", verifyToken, checkRole(['admin']), grupPenggunaController.deleteGrupPengguna);
router.get("/:id", verifyToken, grupPenggunaController.getGrupPenggunaById);

export default router;
