import db from "../config/db.js";

// Add a new comment for a product
export const addKomentar = async (produk_id, pengguna_id, konten) => {
  try {
    // Menjalankan query untuk menyisipkan komentar ke tabel Produk_Komentar
    const [result] = await db
      .getDbConnection() // Pastikan fungsi ini mengembalikan koneksi yang valid
      .query(
        "INSERT INTO Produk_Komentar (produk_id, pengguna_id, konten) VALUES (?, ?, ?)",
        [produk_id, pengguna_id, konten]
      );

    // Mengembalikan ID komentar baru yang telah ditambahkan
    return result.insertId;
  } catch (error) {
    // Menangkap dan melemparkan error jika ada masalah saat memasukkan data
    throw new Error("Gagal menambahkan komentar: " + error.message);
  }
};

// Get all comments for a product
export const getAllKomentar = async (produk_id) => {
  try {
    const [komentar] = await db.getDbConnection().query(
      `SELECT 
        pk.*, 
        pr.nama AS pengguna_nama, 
        pr.gambar AS pengguna_gambar
      FROM Produk_Komentar pk
      LEFT JOIN Profil pr ON pk.pengguna_id = pr.pengguna_id
      WHERE pk.produk_id = ?`,
      [produk_id]
    );
    return komentar;
  } catch (error) {
    throw new Error("Gagal mengambil komentar: " + error.message);
  }
};

// Get the number of comments for a product
export const getJumlahKomentar = async (produk_id) => {
  try {
    const [rows] = await db
      .getDbConnection()
      .query("SELECT COUNT(*) AS komentar_count FROM Produk_Komentar WHERE produk_id = ?", [produk_id]);
    return rows[0].komentar_count;
  } catch (error) {
    console.error("Error fetching comment count:", error);
    throw error;
  }
};

// Get a comment by its ID
export const getKomentarById = async (id) => {
  try {
    const [komentar] = await db
      .getDbConnection()
      .query("SELECT * FROM Produk_Komentar WHERE id = ?", [id]);
    return komentar.length > 0 ? komentar[0] : null;
  } catch (error) {
    throw new Error("Gagal mengambil komentar: " + error.message);
  }
};

// Update a comment by its ID
export const updateKomentar = async (id, konten) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("UPDATE Produk_Komentar SET konten = ? WHERE id = ?", [konten, id]);
    if (result.affectedRows === 0) {
      throw new Error("Komentar tidak ditemukan");
    }
    return result;
  } catch (error) {
    throw new Error("Gagal memperbarui komentar: " + error.message);
  }
};

// Delete a comment by its ID
export const deleteKomentar = async (id) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("DELETE FROM Produk_Komentar WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Gagal menghapus komentar: " + error.message);
  }
};
