import * as beritaModel from "../models/beritaModel.js";
import db from "../config/db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addBerita = async (req, res) => {
  try {
    const { judul, konten } = req.body;

    let gambarPath = null;
    if (req.file) {
      gambarPath = `/uploads/${req.file.filename}`;
    }

    if (!judul || !konten) {
      return res.status(400).json({
        success: false,
        message: "Judul dan konten harus diisi",
      });
    }

    const id = await beritaModel.addBerita(judul, konten, gambarPath);

    res.status(201).json({
      success: true,
      message: "Berita berhasil ditambahkan",
      data: { id, judul, konten, gambar: gambarPath },
    });
  } catch (error) {
    console.error("Error adding berita:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan berita",
    });
  }
};

export const getAllBerita = async (req, res) => {
  const { search } = req.query; // Ambil query parameter 'search'

  try {
    let query = "SELECT * FROM Berita";
    let queryParams = [];

    if (search) {
      query += " WHERE judul LIKE ? OR konten LIKE ?";
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const berita = await beritaModel.getAllBerita(query, queryParams); // Sesuaikan query model
    res.status(200).json(berita);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mendapatkan berita",
      error: error.message,
    });
  }
};

export const getBeritaById = async (req, res) => {
  const { id } = req.params;

  try {
    const berita = await beritaModel.getBeritaById(id);
    if (!berita) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }
    res.status(200).json(berita);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mendapatkan berita",
      error: error.message,
    });
  }
};

export const updateBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, konten } = req.body;

    const beritaLama = await beritaModel.getBeritaById(id);
    if (!beritaLama) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    let gambarPath = beritaLama.gambar;

    // Jika ada gambar baru yang diunggah
    if (req.file) {
      if (gambarPath) {
        const gambarLamaPath = path.join(__dirname, "..", gambarPath);
        if (fs.existsSync(gambarLamaPath)) {
          fs.unlinkSync(gambarLamaPath); // Hapus gambar lama
        }
      }
      gambarPath = `/uploads/${req.file.filename}`; // Path gambar baru
    }

    await beritaModel.updateBerita(id, judul, konten, gambarPath);

    res.status(200).json({
      success: true,
      message: "Berita berhasil diperbarui",
      data: { id, judul, konten, gambar: gambarPath },
    });
  } catch (error) {
    console.error("Error updating berita:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui berita",
    });
  }
};

export const deleteBerita = async (req, res) => {
  try {
    const { id } = req.params;

    const berita = await beritaModel.getBeritaById(id);
    if (!berita) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    // Hapus file gambar jika ada
    if (berita.gambar) {
      const gambarPath = path.join(__dirname, "..", berita.gambar);
      if (fs.existsSync(gambarPath)) {
        fs.unlinkSync(gambarPath);
      }
    }

    await beritaModel.deleteBerita(id);

    res.status(200).json({
      success: true,
      message: "Berita berhasil dihapus beserta gambar",
    });
  } catch (error) {
    console.error("Error deleting berita:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus berita",
    });
  }
};
