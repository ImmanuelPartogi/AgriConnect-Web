import express from 'express';
import * as penggunaController from '../controllers/penggunaController.js';
import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', penggunaController.addPengguna);
router.get('/', verifyToken, checkRole(['admin', 'petani']), penggunaController.getAllPengguna);
router.get('/:id', verifyToken, checkRole(['admin', 'petani']), penggunaController.getPenggunaById);
router.put('/:id', verifyToken, checkRole(['admin', 'petani']), penggunaController.updatePengguna);
router.delete('/:id', verifyToken, checkRole(['admin']), penggunaController.deletePengguna);
router.get('/jumlah/jumlah-terbaru', penggunaController.getJumlahPengguna);
router.get("/daftar/tiga/terbaru", penggunaController.getLatestPengguna);
router.get('/petani/saran', penggunaController.getUserSuggestions);

export default router;
