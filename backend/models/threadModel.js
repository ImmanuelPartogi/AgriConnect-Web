import db from "../config/db.js";

export const getThreadsByForumId = async (forumId) => {
  try {
    const pool = db.getDbConnection();
    const [threads] = await pool.query(
      "SELECT * FROM Thread WHERE forum_id = ? ORDER BY dibuat_pada DESC",
      [forumId]
    );
    return threads;
  } catch (error) {
    throw new Error("Error fetching threads: " + error.message);
  }
};

export const addThread = async (
  forumId,
  penggunaId,
  judul,
  konten,
  gambarPath
) => {
  try {
    const pool = db.getDbConnection();
    const [result] = await pool.query(
      "INSERT INTO Thread (forum_id, pengguna_id, judul, konten, gambar) VALUES (?, ?, ?, ?, ?)",
      [forumId, penggunaId, judul, konten, gambarPath]
    );
    return {
      id: result.insertId,
      forumId,
      penggunaId,
      judul,
      konten,
      gambar: gambarPath,
    };
  } catch (error) {
    throw new Error("Error while creating thread: " + error.message);
  }
};

export const getThreadById = async (id) => {
  try {
    const pool = db.getDbConnection();
    const [thread] = await pool.query("SELECT * FROM Thread WHERE id = ?", [
      id,
    ]);
    return thread[0];
  } catch (error) {
    throw new Error("Error fetching thread: " + error.message);
  }
};

export const deleteThread = async (id) => {
  try {
    const pool = db.getDbConnection();
    await pool.query("DELETE FROM Thread WHERE id = ?", [id]);
  } catch (error) {
    throw new Error("Error deleting thread: " + error.message);
  }
};

export const updateThread = async (id, judul, konten, gambarPath) => {
  try {
    const pool = db.getDbConnection();
    const [result] = await pool.query(
      "UPDATE Thread SET judul = ?, konten = ?, gambar = ? WHERE id = ?",
      [judul, konten, gambarPath, id]
    );
    return result;
  } catch (error) {
    throw new Error("Error while updating thread: " + error.message);
  }
};
