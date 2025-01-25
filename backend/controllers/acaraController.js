import * as acaraModel from "../models/acaraModel.js";

export const addAcara = async (req, res) => {
  const { nama, deskripsi, tanggal, lokasi } = req.body;

  try {
    const id = await acaraModel.addAcara(nama, deskripsi, tanggal, lokasi);
    res.status(201).json({
      message: "Acara berhasil ditambahkan",
      data: { id, nama, deskripsi, tanggal, lokasi },
    });
  } catch (error) {
    console.error("Error adding acara:", error);
    res.status(500).json({
      message: "Gagal menambahkan acara",
      error: error.message,
    });
  }
};

export const getAllAcara = async (req, res) => {
  try {
    const acara = await acaraModel.getAllAcara();
    res.status(200).json(acara);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mendapatkan acara",
      error: error.message,
    });
  }
};

export const getAcaraById = async (req, res) => {
  const { id } = req.params;

  try {
    const acara = await acaraModel.getAcaraById(id);
    if (!acara) {
      return res.status(404).json({ message: "Acara tidak ditemukan" });
    }
    res.status(200).json(acara);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mendapatkan acara",
      error: error.message,
    });
  }
};

export const updateAcara = async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi, tanggal, lokasi } = req.body;

  try {
    const updated = await acaraModel.updateAcara(
      id,
      nama,
      deskripsi,
      tanggal,
      lokasi
    );
    if (!updated) {
      return res.status(404).json({ message: "Acara tidak ditemukan" });
    }
    res.status(200).json({
      message: "Acara berhasil diperbarui",
      data: { id, nama, deskripsi, tanggal, lokasi },
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui acara",
      error: error.message,
    });
  }
};

export const deleteAcara = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await acaraModel.deleteAcara(id);
    if (!deleted) {
      return res.status(404).json({ message: "Acara tidak ditemukan" });
    }
    res.status(200).json({ message: "Acara berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus acara",
      error: error.message,
    });
  }
};
