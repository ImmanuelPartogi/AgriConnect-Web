import db from "../config/db.js";

export const addGrupPengguna = async (nama, deskripsi, dibuatOleh) => {
  try {
    const pool = db.getDbConnection();
    const [result] = await pool.query(
      "INSERT INTO GrupPengguna (nama, deskripsi, dibuat_oleh) VALUES (?, ?, ?)",
      [nama, deskripsi, dibuatOleh]
    );
    return { id: result.insertId, nama, deskripsi, dibuatOleh };
  } catch (error) {
    throw new Error("Error while adding group: " + error.message);
  }
};

export const getAllGrupPengguna = async () => {
  try {
    const pool = db.getDbConnection();
    const [grupPengguna] = await pool.query("SELECT * FROM GrupPengguna");
    return grupPengguna;
  } catch (error) {
    throw new Error("Error fetching groups: " + error.message);
  }
};

export const getGrupPenggunaById = async (id) => {
  try {
    const pool = db.getDbConnection();
    const [rows] = await pool.query("SELECT * FROM GrupPengguna WHERE id = ?", [
      id,
    ]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error("Error while fetching group: " + error.message);
  }
};

export const updateGrupPengguna = async (id, nama, deskripsi) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("UPDATE GrupPengguna SET nama = ?, deskripsi = ? WHERE id = ?", [
        nama,
        deskripsi,
        id,
      ]);
    return result.affectedRows > 0 ? { id, nama, deskripsi } : null;
  } catch (error) {
    throw new Error("Error while updating group: " + error.message);
  }
};

export const deleteGrupPengguna = async (id) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("DELETE FROM GrupPengguna WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Error while deleting group: " + error.message);
  }
};
