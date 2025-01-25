import db from "../config/db.js";

export const addAcara = async (nama, deskripsi, tanggal, lokasi) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query(
        "INSERT INTO Acara (nama, deskripsi, tanggal, lokasi) VALUES (?, ?, ?, ?)",
        [nama, deskripsi, tanggal, lokasi]
      );
    return result.insertId;
  } catch (error) {
    throw new Error("Gagal menambahkan acara: " + error.message);
  }
};

export const getAllAcara = async () => {
  try {
    const [acara] = await db.getDbConnection().query("SELECT * FROM Acara");
    return acara;
  } catch (error) {
    throw new Error("Gagal mengambil semua acara: " + error.message);
  }
};

export const getAcaraById = async (id) => {
  try {
    const [acara] = await db
      .getDbConnection()
      .query("SELECT * FROM Acara WHERE id = ?", [id]);
    return acara.length > 0 ? acara[0] : null;
  } catch (error) {
    throw new Error("Gagal mengambil acara: " + error.message);
  }
};

export const updateAcara = async (id, nama, deskripsi, tanggal, lokasi) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query(
        "UPDATE Acara SET nama = ?, deskripsi = ?, tanggal = ?, lokasi = ? WHERE id = ?",
        [nama, deskripsi, tanggal, lokasi, id]
      );
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Gagal memperbarui acara: " + error.message);
  }
};

export const deleteAcara = async (id) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("DELETE FROM Acara WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Gagal menghapus acara: " + error.message);
  }
};
