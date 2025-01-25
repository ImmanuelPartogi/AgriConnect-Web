import express from 'express';
import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({
    success: true,
    message: 'Admin Dashboard',
    data: req.pengguna,
  });
});

export default router;
