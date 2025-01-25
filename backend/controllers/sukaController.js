import * as sukaModel from "../models/sukaModel.js";

export const addSuka = async (req, res) => {
  try {
    const { penggunaId, produkId } = req.body;

    if (!penggunaId || !produkId) {
      return res.status(400).json({ message: "Pengguna ID dan Produk ID diperlukan" });
    }

    const suka = await sukaModel.addSuka(penggunaId, produkId);
    res.status(201).json({ message: "Suka berhasil ditambahkan.", data: suka });
  } catch (error) {
    console.error("Error adding suka:", error);
    res.status(500).json({ message: "Gagal menambahkan suka." });
  }
};

export const removeSuka = async (req, res) => {
  try {
    const { penggunaId, produkId } = req.body;

    if (!penggunaId || !produkId) {
      return res.status(400).json({ message: "Pengguna ID dan Produk ID diperlukan" });
    }

    const result = await sukaModel.removeSuka(penggunaId, produkId);
    res.status(200).json({ message: "Suka berhasil dihapus." });
  } catch (error) {
    console.error("Error removing suka:", error);
    res.status(500).json({ message: "Gagal menghapus suka." });
  }
};

export const getSukaByPengguna = async (req, res) => {
  try {
    const { penggunaId } = req.params;

    const suka = await sukaModel.getSukaByPengguna(penggunaId);
    res.status(200).json({ message: "Data suka berhasil diambil.", data: suka });
  } catch (error) {
    console.error("Error fetching suka by pengguna:", error);
    res.status(500).json({ message: "Gagal mengambil data suka." });
  }
};

export const countSukaByProduk = async (req, res) => {
  try {
    const { produkId } = req.params;

    const total = await sukaModel.countSukaByProduk(produkId);
    res.status(200).json({ message: "Total suka berhasil dihitung.", total });
  } catch (error) {
    console.error("Error counting suka by produk:", error);
    res.status(500).json({ message: "Gagal menghitung total suka." });
  }
};

export const checkSuka = async (req, res) => {
  try {
      const { penggunaId, produkId } = req.params;
      const suka = await sukaModel.getSukaByPenggunaAndProduk(penggunaId, produkId);
      res.status(200).json({ message: "Status like berhasil diperiksa.", data: suka });
  } catch (error) {
      console.error("Error checking suka:", error);
      res.status(500).json({ message: "Gagal memeriksa status like." });
  }
};