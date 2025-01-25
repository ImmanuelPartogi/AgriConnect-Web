import * as komentarModel from "../models/komentarModel.js";

export const cekPemilikKomentarAtauAdmin = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.peran;

  try {
    const komentar = await komentarModel.getKomentarById(id);
    if (!komentar) {
      return res.status(404).json({ message: "Komentar tidak ditemukan" });
    }
    if (komentar.pengguna_id === userId || userRole === "admin") {
      return next();
    }
    return res
      .status(403)
      .json({
        message:
          "Akses ditolak, Anda tidak memiliki izin untuk mengedit atau menghapus komentar ini",
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan dalam memeriksa pemilik komentar" });
  }
};
