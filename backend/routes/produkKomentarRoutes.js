import express from 'express';
import * as produkKomentarController from "../controllers/produkKomentarController.js";

const router = express.Router();

router.post('/:produk_id', produkKomentarController.createComment);
router.get('/:produk_id', produkKomentarController.getAllComments);
router.get('/:produk_id/count', produkKomentarController.countComments); 
router.put('/:id', produkKomentarController.updateComment); 
router.delete('/:id', produkKomentarController.deleteComment); 

export default router;
