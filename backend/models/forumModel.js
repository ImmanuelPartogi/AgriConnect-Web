import db from "../config/db.js";

export const getAllForum = async () => {
  try {
    const pool = db.getDbConnection();
    const [forums] = await pool.query("SELECT * FROM Forum");
    return forums;
  } catch (error) {
    throw new Error("Error fetching forums: " + error.message);
  }
};

export const getForumById = async (id) => {
  const sql = "SELECT * FROM Forum WHERE id = ?";
  const connection = await db.getDbConnection();
  const [rows] = await connection.execute(sql, [id]);
  return rows[0];
};

export const addForum = async (nama, deskripsi) => {
  try {
    const connection = await db.getDbConnection();
    const [result] = await connection.query(
      "INSERT INTO Forum (nama, deskripsi) VALUES (?, ?)",
      [nama, deskripsi]
    );
    return { id: result.insertId, nama, deskripsi };
  } catch (error) {
    throw new Error("Error while creating forum: " + error.message);
  }
};

export const updateForum = async (id, nama, deskripsi) => {
  const sql = "UPDATE Forum SET nama = ?, deskripsi = ? WHERE id = ?";
  const connection = await db.getDbConnection();
  const [result] = await connection.execute(sql, [nama, deskripsi, id]);
  return result;
};

export const deleteForum = async (id) => {
  const sql = "DELETE FROM Forum WHERE id = ?";
  const connection = await db.getDbConnection();
  const [result] = await connection.execute(sql, [id]);
  return result;
};
