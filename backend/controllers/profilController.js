import * as profilModel from "../models/profilModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addProfil = async (req, res) => {
  try {
    const penggunaId = req.user.id;
    const {
      nama,
      lokasi,
      metode_pertanian,
      produk_ditawarkan,
      bio,
      gambarUrl,
    } = req.body;

    let gambarPath = gambarUrl || null;

    if (req.file) {
      gambarPath = `/uploads/${req.file.filename}`;
    }

    if (!nama || !lokasi || !metode_pertanian || !produk_ditawarkan || !bio) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi",
      });
    }

    await profilModel.addProfil(
      penggunaId,
      nama,
      lokasi,
      metode_pertanian,
      produk_ditawarkan,
      bio,
      gambarPath
    );

    res.status(201).json({
      success: true,
      message: "Profil berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error adding profile:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan profil",
    });
  }
};

export const getProfil = async (req, res) => {
  try {
    const penggunaId = req.user.id;

    const profil = await profilModel.getProfilByPenggunaId(penggunaId);

    if (!profil) {
      return res.status(404).json({
        success: false,
        message: "Profil tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: profil,
    });
  } catch (error) {
    console.error("Error fetching profil:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil profil",
    });
  }
};

export const upsertProfil = async (req, res) => {
  try {
    const penggunaId = req.user.id;
    const { nama, lokasi, metode_pertanian, produk_ditawarkan, bio } = req.body;

    let gambarPath = null;

    const profilLama = await profilModel.getProfilByPenggunaId(penggunaId);

    if (profilLama && profilLama.gambar) {
      const gambarLamaPath = path.join(__dirname, "..", profilLama.gambar);
      console.log("Path gambar lama: ", gambarLamaPath);

      if (fs.existsSync(gambarLamaPath)) {
        fs.unlinkSync(gambarLamaPath);
        console.log("Gambar lama berhasil dihapus: ", gambarLamaPath);
      } else {
        console.log("Gambar lama tidak ditemukan di direktori.");
      }
    }

    if (req.file) {
      gambarPath = `/uploads/${req.file.filename}`;
      console.log("Path gambar baru: ", gambarPath);
    } else if (profilLama && profilLama.gambar) {
      gambarPath = profilLama.gambar;
    }

    const result = await profilModel.upsertProfil(
      penggunaId,
      nama,
      lokasi,
      metode_pertanian,
      produk_ditawarkan,
      bio,
      gambarPath
    );

    res.status(200).json({
      success: true,
      message: "Profil berhasil disimpan",
      data: result,
    });
  } catch (error) {
    console.error("Error during profile upsert:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menyimpan profil",
    });
  }
};

export const deleteProfil = async (req, res) => {
  try {
    const penggunaId = req.user.id;

    const profil = await profilModel.getProfilByPenggunaId(penggunaId);

    if (!profil) {
      return res.status(404).json({
        success: false,
        message: "Profil tidak ditemukan",
      });
    }

    if (profil.gambar) {
      const gambarPath = path.join(__dirname, "..", profil.gambar);
      if (fs.existsSync(gambarPath)) {
        fs.unlinkSync(gambarPath);
        console.log("Gambar berhasil dihapus:", gambarPath);
      } else {
        console.log("Gambar tidak ditemukan di direktori.");
      }
    }

    const result = await profilModel.deleteProfil(penggunaId);

    res.status(200).json({
      success: true,
      message: "Profil berhasil dihapus beserta gambar",
    });
  } catch (error) {
    console.error("Error deleting profil:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus profil",
    });
  }
};

export const getProfilById = async (req, res) => {
  try {
    const penggunaId = req.params.userId;

    // Use the correct method from profilModel
    const profil = await profilModel.getProfilByPenggunaId(penggunaId);

    if (!profil) {
      return res.status(404).json({ message: "Profil not found" });
    }

    res.json(profil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
