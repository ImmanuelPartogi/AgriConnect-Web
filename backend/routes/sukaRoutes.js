import express from 'express';
import * as sukaController from '../controllers/sukaController.js';

const router = express.Router();

router.post('/', sukaController.addSuka);
router.delete('/', sukaController.removeSuka);
router.get('/:penggunaId', sukaController.getSukaByPengguna);
router.get('/count/:produkId', sukaController.countSukaByProduk);
router.get('/:penggunaId/:produkId', sukaController.checkSuka);

export default router;