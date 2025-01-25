import * as forumModel from "../models/forumModel.js";

export const getAllForum = async (req, res) => {
  try {
    const forums = await forumModel.getAllForum();
    res.status(200).json(forums);
  } catch (error) {
    console.error("Error fetching forums:", error);
    res.status(500).json({ message: "Gagal mendapatkan data forum" });
  }
};

export const getForumById = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await forumModel.getForumById(id);
    if (!forum) {
      return res.status(404).json({ message: "Forum tidak ditemukan" });
    }
    res.status(200).json(forum);
  } catch (error) {
    console.error("Error fetching forum:", error);
    res.status(500).json({ message: "Gagal mendapatkan forum" });
  }
};

export const addForum = async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;

    if (!nama || !deskripsi) {
      return res.status(400).json({ message: "Nama dan deskripsi diperlukan" });
    }

    const forum = await forumModel.addForum(nama, deskripsi);
    res
      .status(201)
      .json({ message: "Forum berhasil ditambahkan", data: forum });
  } catch (error) {
    console.error("Error adding forum:", error);
    res
      .status(500)
      .json({ message: "Gagal menambahkan forum", error: error.message });
  }
};

export const updateForum = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi } = req.body;
    await forumModel.updateForum(id, nama, deskripsi);
    res.status(200).json({ message: "Forum berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating forum:", error);
    res.status(500).json({ message: "Gagal memperbarui forum" });
  }
};

export const deleteForum = async (req, res) => {
  try {
    const { id } = req.params;
    await forumModel.deleteForum(id);
    res.status(200).json({ message: "Forum berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting forum:", error);
    res.status(500).json({ message: "Gagal menghapus forum" });
  }
};
