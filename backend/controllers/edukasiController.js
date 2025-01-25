import * as edukasiModel from "../models/edukasiModel.js";
import db from "../config/db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addEdukasi = async (req, res) => {
  const { judul, konten, kategori_id } = req.body;
  const gambar = req.file ? req.file.path : null;

  try {
    const result = await edukasiModel.addEdukasi(
      judul,
      konten,
      kategori_id,
      gambar
    );

    await db
      .getDbConnection()
      .execute(
        "INSERT INTO aktivitas (jenis_aktivitas, deskripsi) VALUES (?, ?)",
        [
          "Edukasi terbaru",
          `Edukasi dengan judul "${judul}" telah dipublikasikan.`,
        ]
      );

    res.status(201).json({ message: "Edukasi berhasil ditambahkan", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menambahkan edukasi", error: error.message });
  }
};

export const getEdukasi = async (req, res) => {
  const { search, kategori } = req.query;
  let query = 'SELECT * FROM Edukasi';
  let queryParams = [];

  if (search) {
    query += ' WHERE judul LIKE ? OR konten LIKE ?';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  if (kategori) {
    query += queryParams.length ? ' AND kategori_id = ?' : ' WHERE kategori_id = ?';
    queryParams.push(kategori);
  }

  try {
    const [rows] = await db.getDbConnection().query(query, queryParams);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data edukasi',
      error: error.message,
    });
  }
};


export const getEdukasiById = async (req, res) => {
  const { id } = req.params;

  try {
    const edukasi = await edukasiModel.getEdukasiById(id);
    if (!edukasi) {
      return res.status(404).json({ message: "Edukasi tidak ditemukan" });
    }
    res.status(200).json({
      ...edukasi,
      gambar: edukasi.gambar
        ? "/uploads/" + path.basename(edukasi.gambar)
        : null, 
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data edukasi", error: error.message });
  }
};

export const updateEdukasi = async (req, res) => {
  const { id } = req.params;
  const { judul, konten, kategori_id } = req.body;
  const gambar = req.file ? req.file.path : null; 

  try {
    const edukasi = await edukasiModel.getEdukasiById(id);

    if (!edukasi) {
      return res.status(404).json({ message: "Edukasi tidak ditemukan" });
    }
    const imageToSave = gambar || edukasi.gambar;

    if (gambar && edukasi.gambar) {
      const gambarPath = path.join(__dirname, "..", edukasi.gambar);
      if (fs.existsSync(gambarPath)) {
        fs.unlinkSync(gambarPath); 
      }
    }

    const result = await edukasiModel.updateEdukasi(
      id,
      judul,
      konten,
      kategori_id,
      imageToSave
    );
    res.status(200).json({ message: "Edukasi berhasil diperbarui", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal memperbarui edukasi", error: error.message });
  }
};

export const deleteEdukasi = async (req, res) => {
  const { id } = req.params;

  try {
    const edukasi = await edukasiModel.getEdukasiById(id);

    if (!edukasi) {
      return res.status(404).json({ message: "Edukasi tidak ditemukan" });
    }

    if (edukasi.gambar) {
      const gambarPath = path.join(__dirname, "..", edukasi.gambar);
      if (fs.existsSync(gambarPath)) {
        fs.unlinkSync(gambarPath);
      }
    }

    const deleted = await edukasiModel.deleteEdukasi(id);
    if (!deleted) {
      return res.status(404).json({ message: "Edukasi tidak ditemukan" });
    }

    res.status(200).json({ message: "Edukasi berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus edukasi", error: error.message });
  }
};

export const getJumlahEdukasi = async (req, res) => {
  try {
    const jumlahEdukasi = await edukasiModel.getJumlahEdukasiFromDB();
    res.json({ count: jumlahEdukasi });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil jumlah edukasi",
      error: error.message,
    });
  }
};
