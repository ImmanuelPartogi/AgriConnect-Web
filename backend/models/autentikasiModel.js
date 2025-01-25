import db from "../config/db.js";

export const addAutentikasi = async (pengguna_id, token, kedaluwarsa_pada) => {
  const sql =
    "INSERT INTO Autentikasi (pengguna_id, token, kedaluwarsa_pada) VALUES (?, ?, ?)";
  await db.query(sql, [pengguna_id, token, kedaluwarsa_pada]);
};

export const getAutentikasiByPenggunaId = async (pengguna_id) => {
  const [rows] = await db.query(
    "SELECT * FROM Autentikasi WHERE pengguna_id = ?",
    [pengguna_id]
  );
  return rows[0];
};

export const deleteAutentikasiByPenggunaId = async (pengguna_id) => {
  await db.query("DELETE FROM Autentikasi WHERE pengguna_id = ?", [
    pengguna_id,
  ]);
};
