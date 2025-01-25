import bcrypt from "bcrypt";
import * as penggunaModel from "../models/penggunaModel.js";
import jwt from "jsonwebtoken";
import { getJumlahPenggunaFromDB } from "../models/penggunaModel.js";
import db from "../config/db.js";

export const addPengguna = async (req, res) => {
  try {
    const {
      nama,
      email,
      kata_sandi,
      pengalaman,
      tentang,
      alamat,
      jenis_kelamin,
      pekerjaan,
      no_hp,
      peran,
    } = req.body;

    if (!nama || !email || !kata_sandi || !pengalaman || !tentang || !alamat) {
      return res
        .status(400)
        .json({ success: false, message: "Data tidak lengkap" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedKataSandi = await bcrypt.hash(kata_sandi, salt);

    const penggunaData = {
      nama,
      email,
      pengalaman,
      tentang,
      alamat,
      jenis_kelamin,
      pekerjaan,
      no_hp,
      kata_sandi: hashedKataSandi,
      peran: peran || "petani",
    };

    await penggunaModel.addPengguna(penggunaData);
    res
      .status(201)
      .json({ success: true, message: "Pengguna berhasil ditambahkan" });

  } catch (error) {
    console.error("Error adding pengguna:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal menambahkan pengguna", error });
  }
};

export const getAllPengguna = async (req, res) => {
  try {
    const pengguna = await penggunaModel.getAllPengguna();
    res.status(200).json({ success: true, data: pengguna });
  } catch (error) {
    console.error("Error fetching pengguna:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mendapatkan data pengguna",
      error,
    });
  }
};

export const getPenggunaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pengguna = await penggunaModel.getPenggunaById(id);
    if (!pengguna)
      return res
        .status(404)
        .json({ success: false, message: "Pengguna tidak ditemukan" });
    res.status(200).json({ success: true, data: pengguna });
  } catch (error) {
    console.error("Error fetching pengguna by id:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mendapatkan data pengguna",
      error,
    });
  }
};

export const updatePengguna = async (req, res) => {
  try {
    const { id } = req.params; // ID pengguna dari URL
    const {
      nama,
      email,
      kata_sandi,
      pengalaman,
      tentang,
      alamat,
      jenis_kelamin,
      pekerjaan,
      no_hp,
      peran,
    } = req.body;

    // Cari data pengguna lama berdasarkan ID
    const penggunaLama = await penggunaModel.getPenggunaById(id); // Pastikan fungsi findById tersedia di model
    if (!penggunaLama) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    // Hash kata sandi baru jika diisi
    let hashedKataSandi = penggunaLama.kata_sandi; // Gunakan kata_sandi lama jika tidak diubah
    if (kata_sandi) {
      const salt = await bcrypt.genSalt(10);
      hashedKataSandi = await bcrypt.hash(kata_sandi, salt);
    }

    // Siapkan data untuk update, gunakan data lama jika data baru tidak diberikan
    const penggunaData = {
      nama: nama || penggunaLama.nama,
      email: email || penggunaLama.email,
      pengalaman: pengalaman || penggunaLama.pengalaman,
      tentang: tentang || penggunaLama.tentang,
      alamat: alamat || penggunaLama.alamat,
      jenis_kelamin: jenis_kelamin || penggunaLama.jenis_kelamin,
      pekerjaan: pekerjaan || penggunaLama.pekerjaan,
      no_hp: no_hp || penggunaLama.no_hp,
      kata_sandi: hashedKataSandi,
      peran: peran || penggunaLama.peran, // Gunakan peran lama jika tidak diubah
    };

    // Perbarui pengguna di database
    const updateResult = await penggunaModel.updatePengguna(id, penggunaData);

    if (updateResult === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Pengguna berhasil diperbarui' });
  } catch (error) {
    console.error('Error updating pengguna:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui pengguna',
      error: error.message,
    });
  }
};


export const deletePengguna = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID pengguna tidak valid" });
    }

    const pengguna = await penggunaModel.getPenggunaById(id);
    if (!pengguna) {
      return res
        .status(404)
        .json({ success: false, message: "Pengguna tidak ditemukan" });
    }

    const userRole = req.user?.peran;
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak, hanya admin yang bisa menghapus",
      });
    }

    await penggunaModel.deletePengguna(id);
    res
      .status(200)
      .json({ success: true, message: "Pengguna berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting pengguna:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal menghapus pengguna", error });
  }
};

export const loginPengguna = async (req, res) => {
  const { email, kata_sandi } = req.body;
  const pengguna = await penggunaModel.getPenggunaByEmail(email);

  if (!pengguna)
    return res
      .status(404)
      .json({ success: false, message: "Pengguna tidak ditemukan" });

  const isMatch = await bcrypt.compare(kata_sandi, pengguna.kata_sandi);
  if (!isMatch)
    return res
      .status(400)
      .json({ success: false, message: "Kata sandi salah" });

  const payload = {
    id: pengguna.id,
    email: pengguna.email,
    role: pengguna.peran,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || "secretKey", {
    expiresIn: "1h",
  });

  res.status(200).json({
    success: true,
    message: "Login berhasil",
    token,
  });
};

export const getJumlahPengguna = async (req, res) => {
  try {
    const jumlahPengguna = await getJumlahPenggunaFromDB();
    res.json({ count: jumlahPengguna });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).send("Server Error");
  }
};

export const getLatestPengguna = async (req, res) => {
  try {
    const pengguna = await penggunaModel.getThreeLatestPengguna();
    res.status(200).json({ success: true, data: pengguna });
  } catch (error) {
    console.error("Error fetching latest pengguna:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mendapatkan data pengguna",
      error,
    });
  }
};

export const getUserSuggestions = async (req, res) => {
  try {
    const role = 'petani';  // You can replace this with dynamic values from req.user.role
    const excludeUserId = req.user.id;  // Get the logged-in user's ID
    const users = await penggunaModel.fetchUserSuggestions(role, excludeUserId);  // Fetch users with the 'petani' role, excluding the logged-in user
    res.json(users);  // Send the results as a JSON response
  } catch (error) {
    console.error("Error fetching user suggestions:", error);
    res.status(500).json({ error: 'Failed to fetch user suggestions' });
  }
};

