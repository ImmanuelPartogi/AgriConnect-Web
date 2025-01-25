import * as blogModel from "../models/blogModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addBlog = async (req, res) => {
  try {
    const penggunaId = req.user.id;
    const { judul, konten, kategori } = req.body;

    let gambarPath = null;

    // Cek apakah ada file gambar yang di-upload
    if (req.file) {
      gambarPath = `/uploads/${req.file.filename}`;
    }

    if (!judul || !konten || !kategori) {
      return res.status(400).json({
        success: false,
        message: "Judul, konten, dan kategori harus diisi",
      });
    }

    const blogId = await blogModel.addBlog(
      penggunaId,
      judul,
      konten,
      kategori,
      gambarPath
    );

    res.status(201).json({
      success: true,
      message: "Blog berhasil ditambahkan",
      data: { id: blogId, judul, konten, kategori, gambar: gambarPath },
    });
  } catch (error) {
    console.error("Error adding blog:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan blog",
    });
  }
};

export const getAllBlogs = async (req, res) => {
  const { search } = req.query; // Get the search term from the query strin

  try {
    let query = "SELECT * FROM Blog";
    let queryParams = [];

    if (search) {
      query += ' WHERE judul LIKE ? OR konten LIKE ? OR kategori LIKE ?';
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const blogs = await blogModel.getAllBlogs(query, queryParams);
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error); // Log detailed errors
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data blog', error: error.message });
  }
};


export const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await blogModel.getBlogById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog tidak ditemukan" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mendapatkan blog",
      error: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil data blog untuk mendapatkan gambar yang terkait
    const blog = await blogModel.getBlogById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog tidak ditemukan",
      });
    }

    // Hapus gambar jika ada
    if (blog.gambar) {
      const gambarPath = path.join(__dirname, "..", blog.gambar);
      if (fs.existsSync(gambarPath)) {
        fs.unlinkSync(gambarPath); // Hapus gambar
        console.log("Gambar berhasil dihapus:", gambarPath);
      }
    }

    // Hapus blog dari database
    const deleted = await blogModel.deleteBlog(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Blog tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog berhasil dihapus beserta gambar",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus blog",
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, konten, kategori } = req.body;

    let gambarPath = null;

    // Ambil data blog lama dari database untuk memeriksa gambar sebelumnya
    const blogLama = await blogModel.getBlogById(id);

    if (!blogLama) {
      return res.status(404).json({
        success: false,
        message: "Blog tidak ditemukan",
      });
    }

    // Hapus gambar lama jika ada dan ada gambar baru yang di-upload
    if (req.file) {
      if (blogLama.gambar) {
        const gambarLamaPath = path.join(__dirname, "..", blogLama.gambar);
        if (fs.existsSync(gambarLamaPath)) {
          fs.unlinkSync(gambarLamaPath); // Menghapus gambar lama
          console.log("Gambar lama berhasil dihapus:", gambarLamaPath);
        }
      }
      gambarPath = `/uploads/${req.file.filename}`;
    } else if (blogLama.gambar) {
      gambarPath = blogLama.gambar; // Jika tidak ada gambar baru, gunakan gambar lama
    }

    // Update blog ke database
    const updated = await blogModel.updateBlog(
      id,
      judul,
      konten,
      kategori,
      gambarPath
    );

    if (!updated) {
      return res.status(404).json({ message: "Blog tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Blog berhasil diperbarui",
      data: { id, judul, konten, kategori, gambar: gambarPath },
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui blog",
    });
  }
};
