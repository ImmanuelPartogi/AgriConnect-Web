import express from 'express';
import * as aktivitasController from '../controllers/aktivitasController.js';

const router = express.Router();

router.get('/', aktivitasController.getAktivitasTerbaru);

export default router;
