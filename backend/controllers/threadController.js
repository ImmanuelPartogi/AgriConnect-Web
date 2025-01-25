import * as threadModel from "../models/threadModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getThreadsByForum = async (req, res) => {
  try {
    const { forumId } = req.params;
    const threads = await threadModel.getThreadsByForumId(forumId);
    res.status(200).json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "Gagal mendapatkan data thread" });
  }
};

export const createThread = async (req, res) => {
  try {
    const { forumId } = req.params;
    const penggunaId = req.user.id;
    const { judul, konten } = req.body;

    if (!judul || !konten) {
      return res.status(400).json({ message: "Judul dan konten diperlukan" });
    }

    let gambarPath = null;

    // Jika ada file gambar yang di-upload
    if (req.file) {
      gambarPath = `/uploads/${req.file.filename}`;
    }

    const thread = await threadModel.addThread(
      forumId,
      penggunaId,
      judul,
      konten,
      gambarPath // Simpan path gambar ke database
    );
    res
      .status(201)
      .json({ message: "Thread berhasil ditambahkan", data: thread });
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({ message: "Gagal menambahkan thread" });
  }
};

export const updateThread = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, konten } = req.body;

    if (!judul || !konten) {
      return res.status(400).json({ message: "Judul dan konten diperlukan" });
    }

    let gambarPath = null;

    // Jika ada file gambar yang di-upload
    if (req.file) {
      gambarPath = `/uploads/${req.file.filename}`;  // Path relatif untuk disimpan di DB

      // Hapus gambar lama jika ada
      const threadLama = await threadModel.getThreadById(id);
      if (threadLama && threadLama.gambar) {
        const gambarLamaPath = path.join(__dirname, "..", threadLama.gambar);  // Path absolut
        if (fs.existsSync(gambarLamaPath)) {
          fs.unlinkSync(gambarLamaPath);  // Hapus gambar lama
        }
      }
    }

    await threadModel.updateThread(id, judul, konten, gambarPath);
    res.status(200).json({ message: "Thread berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating thread:", error);
    res.status(500).json({ message: "Gagal memperbarui thread" });
  }
};

export const removeThread = async (req, res) => {
  try {
    const { id } = req.params;
    const thread = await threadModel.getThreadById(id);

    if (thread && thread.gambar) {
      const gambarPath = path.join(__dirname, "..", thread.gambar);  // Path absolut
      if (fs.existsSync(gambarPath)) {
        fs.unlinkSync(gambarPath);  // Menghapus gambar ketika thread dihapus
      }
    }

    await threadModel.deleteThread(id);
    res.status(200).json({ message: "Thread berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting thread:", error);
    res.status(500).json({ message: "Gagal menghapus thread" });
  }
};
