import db from "../config/db.js";

export const addBerita = async (judul, konten, gambar) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("INSERT INTO Berita (judul, konten, gambar) VALUES (?, ?, ?)", [
        judul,
        konten,
        gambar,
      ]);
    return result.insertId;
  } catch (error) {
    throw new Error("Gagal menambahkan berita: " + error.message);
  }
};

export const getAllBerita = async (query, queryParams) => {
  try {
    const [rows] = await db.getDbConnection().query(query, queryParams);
    return rows;
  } catch (error) {
    throw new Error("Error fetching berita: " + error.message);
  }
};

export const getBeritaById = async (id) => {
  try {
    const [berita] = await db
      .getDbConnection()
      .query("SELECT * FROM Berita WHERE id = ?", [id]);
    return berita.length > 0 ? berita[0] : null;
  } catch (error) {
    throw new Error("Gagal mengambil berita: " + error.message);
  }
};

export const updateBerita = async (id, judul, konten, gambar) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query(
        "UPDATE Berita SET judul = ?, konten = ?, gambar = ? WHERE id = ?",
        [judul, konten, gambar, id]
      );
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Gagal memperbarui berita: " + error.message);
  }
};

export const deleteBerita = async (id) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("DELETE FROM Berita WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Gagal menghapus berita: " + error.message);
  }
};
