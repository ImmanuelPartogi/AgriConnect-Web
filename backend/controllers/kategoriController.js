import * as kategoriModel from "../models/kategoriModel.js";

export const addKategori = async (req, res) => {
  const { nama, jenis } = req.body;

  try {
    const id = await kategoriModel.addKategori(nama, jenis);
    res.status(201).json({
      message: "Kategori berhasil ditambahkan",
      data: { id, nama, jenis },
    });
  } catch (error) {
    console.error("Error adding kategori:", error);
    res.status(500).json({
      message: "Gagal menambahkan kategori",
      error: error.message,
    });
  }
};

export const getAllKategori = async (req, res) => {
  try {
    const kategori = await kategoriModel.getAllKategori();
    res.status(200).json(kategori);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mendapatkan kategori",
      error: error.message,
    });
  }
};

export const getKategoriById = async (req, res) => {
  const { id } = req.params;

  try {
    const kategori = await kategoriModel.getKategoriById(id);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    res.status(200).json(kategori);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mendapatkan kategori",
      error: error.message,
    });
  }
};

export const updateKategori = async (req, res) => {
  const { id } = req.params;
  const { nama, jenis } = req.body;

  try {
    const updated = await kategoriModel.updateKategori(id, nama, jenis);
    if (!updated) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    res.status(200).json({
      message: "Kategori berhasil diperbarui",
      data: { id, nama, jenis },
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui kategori",
      error: error.message,
    });
  }
};

export const deleteKategori = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await kategoriModel.deleteKategori(id);
    if (!deleted) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    res.status(200).json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus kategori",
      error: error.message,
    });
  }
};
