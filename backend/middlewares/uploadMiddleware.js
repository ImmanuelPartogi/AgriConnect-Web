import multer from 'multer';
import path from 'path';

// Tentukan lokasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Pastikan folder 'uploads' sudah ada
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Membuat nama unik untuk file
  },
});

// Validasi jenis file gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Izinkan file gambar
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan'), false);
  }
};

// Middleware untuk upload file
const upload = multer({ storage, fileFilter });

export default upload;
