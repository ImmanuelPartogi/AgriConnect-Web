import * as pasarModel from "../models/pasarModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addPasar = async (req, res) => {
  const { produk_id, lokasi, deskripsi } = req.body;
  const pengguna_id = req.user.id;

  const gambar = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pasarModel.addPasar(
      produk_id,
      pengguna_id,
      lokasi,
      deskripsi,
      gambar
    );
    res.status(201).json({ message: "Pasar berhasil ditambahkan", result });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambahkan pasar",
      error: error.message,
    });
  }
};

export const getPasar = async (req, res) => {
  try {
    const pasar = await pasarModel.getPasar();
    res.status(200).json(pasar);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data pasar",
      error: error.message,
    });
  }
};

export const getPasarById = async (req, res) => {
  const { id } = req.params;

  try {
    const pasar = await pasarModel.getPasarById(id);
    if (!pasar) {
      return res.status(404).json({ message: "Pasar tidak ditemukan" });
    }
    res.status(200).json(pasar);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data pasar",
      error: error.message,
    });
  }
};

export const deletePasar = async (req, res) => {
  const { id } = req.params;

  try {
    const pasar = await pasarModel.getPasarById(id);

    // Jika ada gambar, hapus gambar dari direktori
    if (pasar.gambar) {
      const gambarPath = path.join(__dirname, "..", pasar.gambar);
      if (fs.existsSync(gambarPath)) {
        fs.unlinkSync(gambarPath);
      }
    }

    const deleted = await pasarModel.deletePasar(id);
    if (!deleted) {
      return res.status(404).json({ message: "Pasar tidak ditemukan" });
    }

    res.status(200).json({ message: "Pasar berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus pasar",
      error: error.message,
    });
  }
};

export const updatePasar = async (req, res) => {
  const { id } = req.params;
  const { produk_id, lokasi, deskripsi } = req.body;

  // Menyimpan path gambar baru jika ada
  const gambar = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Ambil data pasar lama untuk memeriksa gambar lama
    const pasarLama = await pasarModel.getPasarById(id);

    // Jika ada gambar lama, hapus dari direktori
    if (pasarLama.gambar && gambar) {
      const oldImagePath = path.join(__dirname, "..", pasarLama.gambar);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Perbarui data pasar
    const result = await pasarModel.updatePasar(
      id,
      produk_id,
      lokasi,
      deskripsi,
      gambar || pasarLama.gambar // Gunakan gambar baru jika ada, jika tidak, gunakan gambar lama
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pasar tidak ditemukan" });
    }

    res.status(200).json({ message: "Pasar berhasil diperbarui", result });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui pasar",
      error: error.message,
    });
  }
};
