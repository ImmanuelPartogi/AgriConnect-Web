import * as grupPenggunaModel from "../models/grupPenggunaModel.js";

export const addGrupPengguna = async (req, res) => {
  const { nama, deskripsi } = req.body;
  const { id: penggunaId } = req.user;

  try {
    const grup = await grupPenggunaModel.addGrupPengguna(
      nama,
      deskripsi,
      penggunaId
    );
    res.status(201).json({
      message: "Grup pengguna berhasil dibuat",
      data: grup,
    });
  } catch (error) {
    console.error("Error adding group:", error);
    res.status(500).json({
      message: "Gagal membuat grup pengguna",
      error: error.message,
    });
  }
};

export const getAllGrupPengguna = async (req, res) => {
  try {
    const grupPengguna = await grupPenggunaModel.getAllGrupPengguna();
    res.status(200).json(grupPengguna);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({
      message: "Gagal mendapatkan grup pengguna",
      error: error.message,
    });
  }
};

export const updateGrupPengguna = async (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi } = req.body;

  try {
    const updatedGrup = await grupPenggunaModel.updateGrupPengguna(
      id,
      nama,
      deskripsi
    );
    if (!updatedGrup) {
      return res.status(404).json({ message: "Grup tidak ditemukan" });
    }

    res.status(200).json({
      message: "Grup berhasil diperbarui",
      data: updatedGrup,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui grup" });
  }
};

export const deleteGrupPengguna = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGrup = await grupPenggunaModel.deleteGrupPengguna(id);
    if (!deletedGrup) {
      return res.status(404).json({ message: "Grup tidak ditemukan" });
    }

    res.status(200).json({
      message: "Grup berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus grup" });
  }
};

export const getGrupPenggunaById = async (req, res) => {
  const { id } = req.params;

  try {
    const grup = await grupPenggunaModel.getGrupPenggunaById(id);
    if (!grup) {
      return res.status(404).json({ message: "Grup tidak ditemukan" });
    }

    res.status(200).json(grup);
  } catch (error) {
    console.error("Error fetching group by ID:", error);
    res
      .status(500)
      .json({ message: "Gagal mendapatkan grup", error: error.message });
  }
};
