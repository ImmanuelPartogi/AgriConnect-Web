import db from "../config/db.js";

export const getAllKomentarByThreadId = async (threadId) => {
  try {
    const pool = db.getDbConnection();
    const [komentar] = await pool.query(
      "SELECT * FROM Komentar WHERE thread_id = ? ORDER BY dibuat_pada DESC",
      [threadId]
    );
    return komentar;
  } catch (error) {
    throw new Error("Error fetching comments: " + error.message);
  }
};

export const addKomentar = async (threadId, penggunaId, konten) => {
  try {
    const pool = db.getDbConnection();
    const [result] = await pool.query(
      "INSERT INTO Komentar (thread_id, pengguna_id, konten) VALUES (?, ?, ?)",
      [threadId, penggunaId, konten]
    );
    return { id: result.insertId, threadId, penggunaId, konten };
  } catch (error) {
    throw new Error("Error while adding comment: " + error.message);
  }
};

export const getKomentarById = async (id) => {
  const [rows] = await db
    .getDbConnection()
    .query("SELECT * FROM Komentar WHERE id = ?", [id]);
  return rows[0]; 
};

export const updateKomentar = async (id, konten) => {
  const [result] = await db
    .getDbConnection()
    .query("UPDATE Komentar SET konten = ? WHERE id = ?", [konten, id]);
  return result.affectedRows > 0 ? { id, konten } : null;
};

export const deleteKomentar = async (id) => {
  const [result] = await db
    .getDbConnection()
    .query("DELETE FROM Komentar WHERE id = ?", [id]);
  return result.affectedRows > 0;
};
