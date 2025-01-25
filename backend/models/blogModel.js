import db from "../config/db.js";

export const addBlog = async (pengguna_id, judul, konten, kategori, gambar) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query(
        "INSERT INTO Blog (pengguna_id, judul, konten, kategori, gambar) VALUES (?, ?, ?, ?, ?)",
        [pengguna_id, judul, konten, kategori, gambar]
      );
    return result.insertId;
  } catch (error) {
    throw new Error("Gagal menambahkan blog: " + error.message);
  }
};

export const getAllBlogs = async (query = null, queryParams = []) => {
  try {
    if (!query) {
      query = `
        SELECT Blog.*, Pengguna.nama AS nama 
        FROM Blog 
        JOIN Pengguna ON Blog.pengguna_id = Pengguna.id 
        ORDER BY Blog.dibuat_pada DESC
      `;
    }

    const [rows] = await db.getDbConnection().query(query, queryParams);
    console.log('Fetched Blogs:', rows); 
    return rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Gagal mendapatkan blog: " + error.message);
  }
};

export const getBlogById = async (id) => {
  try {
    const [blog] = await db.getDbConnection().query(
      `
      SELECT 
        Blog.*, 
        Pengguna.nama AS nama
      FROM Blog 
      JOIN Pengguna ON Blog.pengguna_id = Pengguna.id 
      WHERE Blog.id = ?
    `,
      [id]
    );

    if (blog.length === 0) {
      throw new Error("Blog tidak ditemukan");
    }

    return blog[0]; // Mengembalikan data blog dengan nama pengguna
  } catch (error) {
    throw new Error("Gagal mendapatkan blog: " + error.message);
  }
};

export const deleteBlog = async (id) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("DELETE FROM Blog WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Gagal menghapus blog: " + error.message);
  }
};

export const updateBlog = async (id, judul, konten, kategori, gambar) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query(
        "UPDATE Blog SET judul = ?, konten = ?, kategori = ?, gambar = ? WHERE id = ?",
        [judul, konten, kategori, gambar, id]
      );
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Gagal memperbarui blog: " + error.message);
  }
};
