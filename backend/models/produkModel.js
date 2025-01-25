import db from "../config/db.js";

export const addProduk = async (
  pengguna_id,
  nama,
  deskripsi,
  kategori_id,
  harga,
  lokasi,
  stok,
  gambar
) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query(
        "INSERT INTO Produk (pengguna_id, nama, deskripsi, kategori_id, harga, lokasi, stok, gambar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [pengguna_id, nama, deskripsi, kategori_id, harga, lokasi, stok, gambar]
      );
    return result.insertId;
  } catch (error) {
    throw new Error("Gagal menambahkan produk: " + error.message);
  }
};

export const getAllProduk = async () => {
  try {
    const [produk] = await db.getDbConnection().query(`
      SELECT 
        p.*, 
        k.nama AS kategori_nama,
        pr.nama AS pengguna_nama,
        pr.gambar AS pengguna_gambar
      FROM Produk p
      LEFT JOIN Kategori k ON p.kategori_id = k.id
      LEFT JOIN Profil pr ON p.pengguna_id = pr.pengguna_id
    `);
    return produk;
  } catch (error) {
    throw new Error("Gagal mengambil semua produk: " + error.message);
  }
};

export const getProdukByUserId = async (userId) => {
  try {
    const connection = await db.getDbConnection();
    const [rows] = await connection.query(
      "SELECT * FROM produk WHERE pengguna_id = ?",
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw new Error("Error fetching products");
  }
};

export const updateProduk = async (
  id,
  nama,
  deskripsi,
  kategori_id,
  harga,
  lokasi,
  stok,
  gambar
) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query(
        "UPDATE Produk SET nama = ?, deskripsi = ?, kategori_id = ?, harga = ?, lokasi = ?, stok = ?, gambar = ? WHERE id = ?",
        [nama, deskripsi, kategori_id, harga, lokasi, stok, gambar, id]
      );

    if (result.affectedRows === 0) {
      throw new Error("Produk tidak ditemukan");
    }
    return result;
  } catch (error) {
    throw new Error("Gagal memperbarui produk: " + error.message);
  }
};

export const deleteProduk = async (id) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("DELETE FROM Produk WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Gagal menghapus produk: " + error.message);
  }
};

export const getJumlahProdukFromDB = async () => {
  try {
    const [rows] = await db
      .getDbConnection()
      .query("SELECT COUNT(*) AS product_count FROM Produk");
    return rows[0].product_count;
  } catch (error) {
    console.error("Error fetching product count:", error);
    throw error;
  }
};

export const getProdukById = async (id) => {
  try {
    const [produk] = await db
      .getDbConnection()
      .query("SELECT * FROM Produk WHERE id = ?", [id]);
    return produk.length > 0 ? produk[0] : null;
  } catch (error) {
    throw new Error("Gagal mengambil Produk: " + error.message);
  }
};

export const getAllProdukByUserId = async (userId) => {
  try {
    const connection = await db.getDbConnection();
    const [rows] = await connection.query(
      `
      SELECT 
        p.*, 
        k.nama AS kategori_nama 
      FROM produk p
      LEFT JOIN kategori k ON p.kategori_id = k.id
      WHERE p.pengguna_id = ?
      `,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw new Error("Error fetching products");
  }
};
