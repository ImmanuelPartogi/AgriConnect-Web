import * as produkModel from "../models/produkModel.js";
import * as kategoriModel from "../models/kategoriModel.js";
import { getJumlahProdukFromDB } from "../models/produkModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addProduk = async (req, res) => {
  try {
    const penggunaId = req.user.id;
    const { nama, deskripsi, kategori_id, harga, lokasi, stok } = req.body;

    let gambarPath = null;

    // Jika gambar di-upload, simpan path file gambar
    if (req.file) {
      gambarPath = `/uploads/${req.file.filename}`;
    }

    if (!nama || !kategori_id || !harga || !lokasi || stok == null) {
      return res.status(400).json({
        success: false,
        message: "Field yang wajib diisi tidak boleh kosong",
      });
    }

    await produkModel.addProduk(
      penggunaId,
      nama,
      deskripsi,
      kategori_id,
      harga,
      lokasi,
      stok,
      gambarPath
    );

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error adding produk:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan produk",
    });
  }
};

export const getAllProduk = async (req, res) => {
  try {
    // Query untuk menyertakan kategori jika ada relasi
    const produk = await produkModel.getAllProduk({
      include: [
        {
          model: kategoriModel, // Model kategori
          as: "kategori", // Alias sesuai relasi di model
          attributes: ["id", "nama"], // Kolom yang ingin diambil
        },
      ],
    });

    res.status(200).json(produk);
  } catch (error) {
    console.error("Error fetching all products: ", error);
    res.status(500).json({
      success: false,
      message: "Gagal mendapatkan semua produk",
      error: error.message,
    });
  }
};

export const updateProduk = async (req, res) => {
  try {
    const { produk_id } = req.params;
    const { nama, deskripsi, kategori_id, harga, lokasi, stok } = req.body;

    // Ambil data produk lama
    const produkLama = await produkModel.getProdukById(produk_id);

    if (!produkLama) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    let gambarPath = produkLama.gambar;

    // Hapus gambar lama jika ada dan ada gambar baru yang di-upload
    if (req.file) {
      if (gambarPath) {
        const oldImagePath = path.join(__dirname, "..", gambarPath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image file
        }
      }
      gambarPath = `/uploads/${req.file.filename}`; // New image path
    }

    // Update the product in the database
    await produkModel.updateProduk(
      produk_id,
      nama,
      deskripsi,
      kategori_id, // Use kategori_id as expected by the backend
      harga,
      lokasi,
      stok,
      gambarPath
    );

    res.status(200).json({
      success: true,
      message: "Produk berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating produk:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui produk",
    });
  }
};

export const deleteProduk = async (req, res) => {
  try {
    const { produk_id } = req.params;

    // Ambil data produk untuk mendapatkan gambar
    const produk = await produkModel.getProdukById(produk_id);

    if (!produk) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    // Hapus gambar jika ada
    if (produk.gambar) {
      const gambarPath = path.join(__dirname, "..", produk.gambar);
      if (fs.existsSync(gambarPath)) {
        fs.unlinkSync(gambarPath);
      }
    }

    await produkModel.deleteProduk(produk_id);

    res.status(200).json({
      success: true,
      message: "Produk berhasil dihapus beserta gambar",
    });
  } catch (error) {
    console.error("Error deleting produk:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus produk",
    });
  }
};

export const getJumlahProduk = async (req, res) => {
  try {
    const jumlahProduk = await getJumlahProdukFromDB();
    res.json({ count: jumlahProduk });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).send("Server Error");
  }
};

export const getProdukByUserId = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID tidak ditemukan" });
    }

    const products = await produkModel.getProdukByUserId(userId); // Memanggil model untuk mengambil produk berdasarkan userId
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products: ", err);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil produk" });
  }
};

export const getProdukById = async (req, res) => {
  const { id } = req.params;

  try {
    const produk = await produkModel.getProdukById(id, {
      include: [
        {
          model: kategoriModel, // Ganti dengan model kategori yang sesuai
          as: "kategori", // Ini harus sesuai dengan asosiasi yang ada
          attributes: ["id", "nama"], // Mengambil ID dan nama kategori
        },
      ],
    });

    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Pastikan kategori ada dan jika tidak ada, kirim kategori default
    if (produk.kategori) {
      produk.kategori_id = produk.kategori.nama; // Menambahkan nama kategori
    }

    res.status(200).json(produk);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mendapatkan produk",
      error: error.message,
    });
  }
};

export const getAllProdukById = async (req, res) => {
  const { id } = req.params;

  try {
    const produk = await produkModel.getAllProdukByUserId(id);

    if (!produk || produk.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const result = produk.map((item) => ({
      id: item.id,
      nama: item.nama,
      deskripsi: item.deskripsi,
      kategori: item.kategori_nama || "Kategori tidak tersedia",
      harga: item.harga,
      lokasi: item.lokasi,
      stok: item.stok,
      gambar: item.gambar,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching products: ", error.message);
    res.status(500).json({
      message: "Gagal mendapatkan produk",
      error: error.message,
    });
  }
};

