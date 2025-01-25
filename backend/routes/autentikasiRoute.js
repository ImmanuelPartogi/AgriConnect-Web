import express from 'express';
import * as autentikasiController from '../controllers/autentikasiController.js';

const router = express.Router();

router.post('/login', autentikasiController.loginPengguna);
router.post("/register", autentikasiController.registrasiPengguna);
router.post('/logout', autentikasiController.logoutPengguna);
router.put("/pengguna/:id", autentikasiController.updatePengguna);
router.delete("/pengguna/:id", autentikasiController.deletePengguna);
router.get("/pengguna", autentikasiController.getAllPengguna);
router.get("/pengguna/:id", autentikasiController.getPenggunaById);

export default router;
    