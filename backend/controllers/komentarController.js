import * as komentarModel from "../models/komentarModel.js";
import * as threadModel from "../models/threadModel.js";

export const getKomentarByThreadId = async (req, res) => {
  try {
    const { threadId } = req.params;
    const komentar = await komentarModel.getAllKomentarByThreadId(threadId);
    res.status(200).json(komentar);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Gagal mendapatkan komentar" });
  }
};

export const addKomentar = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { id: penggunaId } = req.user;
    const { konten } = req.body;

    const thread = await threadModel.getThreadById(threadId);
    if (!thread) {
      return res.status(404).json({ message: "Thread tidak ditemukan" });
    }

    const komentar = await komentarModel.addKomentar(
      threadId,
      penggunaId,
      konten
    );
    res.status(201).json({
      message: "Komentar berhasil ditambahkan",
      data: komentar,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      message: "Gagal menambahkan komentar",
      error: error.message,
    });
  }
};

export const updateKomentar = async (req, res) => {
  const { id } = req.params;
  const { konten } = req.body;

  try {
    const updatedKomentar = await komentarModel.updateKomentar(id, konten);
    if (!updatedKomentar) {
      return res.status(404).json({ message: "Komentar tidak ditemukan" });
    }

    res.status(200).json({
      message: "Komentar berhasil diperbarui",
      data: updatedKomentar,
    });
  } catch (error) {
    console.error("Error updating komentar:", error);
    res.status(500).json({
      message: "Gagal memperbarui komentar",
      error: error.message,
    });
  }
};

export const deleteKomentar = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedKomentar = await komentarModel.deleteKomentar(id);
    if (!deletedKomentar) {
      return res.status(404).json({ message: "Komentar tidak ditemukan" });
    }

    res.status(200).json({
      message: "Komentar berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting komentar:", error);
    res.status(500).json({
      message: "Gagal menghapus komentar",
      error: error.message,
    });
  }
};
