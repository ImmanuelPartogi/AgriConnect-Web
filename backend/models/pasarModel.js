import db from "../config/db.js";

export const addPasar = async (
  produk_id,
  pengguna_id,
  lokasi,
  deskripsi,
  gambar
) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query(
        "INSERT INTO Pasar (produk_id, pengguna_id, lokasi, deskripsi, gambar) VALUES (?, ?, ?, ?, ?)",
        [produk_id, pengguna_id, lokasi, deskripsi, gambar]
      );
    return result;
  } catch (error) {
    throw new Error("Gagal menambahkan pasar: " + error.message);
  }
};

export const getPasar = async () => {
  try {
    const [rows] = await db.getDbConnection().query("SELECT * FROM Pasar");
    return rows;
  } catch (error) {
    throw new Error("Gagal mengambil data pasar: " + error.message);
  }
};

export const getPasarById = async (id) => {
  try {
    const [rows] = await db
      .getDbConnection()
      .query("SELECT * FROM Pasar WHERE id = ?", [id]);
    return rows[0];
  } catch (error) {
    throw new Error("Gagal mengambil data pasar: " + error.message);
  }
};

export const deletePasar = async (id) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("DELETE FROM Pasar WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Gagal menghapus pasar: " + error.message);
  }
};

export const updatePasar = async (id, produk_id, lokasi, deskripsi, gambar) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query(
        "UPDATE Pasar SET produk_id = ?, lokasi = ?, deskripsi = ?, gambar = ? WHERE id = ?",
        [produk_id, lokasi, deskripsi, gambar, id]
      );
    return result;
  } catch (error) {
    throw new Error("Gagal memperbarui pasar: " + error.message);
  }
};
