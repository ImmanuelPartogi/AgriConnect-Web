import db from "../config/db.js";

export const addKategori = async (nama, jenis) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("INSERT INTO Kategori (nama, jenis) VALUES (?, ?)", [nama, jenis]);
    return result.insertId;
  } catch (error) {
    throw new Error("Gagal menambahkan kategori: " + error.message);
  }
};

export const getAllKategori = async () => {
  try {
    const [kategori] = await db.getDbConnection().query("SELECT * FROM Kategori");
    return kategori;
  } catch (error) {
    throw new Error("Gagal mengambil semua kategori: " + error.message);
  }
};

export const getKategoriById = async (id) => {
  try {
    const [kategori] = await db
      .getDbConnection()
      .query("SELECT * FROM Kategori WHERE id = ?", [id]);
    return kategori.length > 0 ? kategori[0] : null;
  } catch (error) {
    throw new Error("Gagal mengambil kategori: " + error.message);
  }
};

export const updateKategori = async (id, nama, jenis) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("UPDATE Kategori SET nama = ?, jenis = ? WHERE id = ?", [
        nama,
        jenis,
        id,
      ]);
    return result.affectedRows > 0; 
  } catch (error) {
    throw new Error("Gagal memperbarui kategori: " + error.message);
  }
};

export const deleteKategori = async (id) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("DELETE FROM Kategori WHERE id = ?", [id]);
    return result.affectedRows > 0; 
  } catch (error) {
    throw new Error("Gagal menghapus kategori: " + error.message);
  }
};
