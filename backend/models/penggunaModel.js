import db from "../config/db.js";

export const addPengguna = async (data) => {
  const sql = `INSERT INTO Pengguna 
    (nama, email, pengalaman, tentang, alamat, jenis_kelamin, pekerjaan, no_hp, kata_sandi, peran) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const {
    nama,
    email,
    pengalaman,
    tentang,
    alamat,
    jenis_kelamin,
    pekerjaan,
    no_hp,
    kata_sandi,
    peran,
  } = data;

  try {
    const connection = await db.getDbConnection();
    const [rows] = await connection.execute(sql, [
      nama,
      email,
      pengalaman || null,
      tentang || null,
      alamat || null,
      jenis_kelamin || null,
      pekerjaan || null,
      no_hp || null,
      kata_sandi,
      peran,
    ]);
    console.log("Rows hasil query: ", rows);
    return rows;
  } catch (error) {
    console.log("Error adding pengguna: ", error);
    throw error;
  }
};

export const getAllPengguna = async () => {
  const sql = "SELECT * FROM Pengguna";

  try {
    const connection = await db.getDbConnection();
    const [rows] = await connection.execute(sql);
    return rows;
  } catch (error) {
    console.error("Error fetching all pengguna:", error);
    throw error;
  }
};

export const getPenggunaById = async (id) => {
  const sql = "SELECT * FROM Pengguna WHERE id = ?";

  try {
    const connection = await db.getDbConnection();
    const [rows] = await connection.execute(sql, [id]);
    return rows[0];
  } catch (error) {
    console.error("Error fetching pengguna by ID:", error);
    throw error;
  }
};

export const updatePengguna = async (id, data) => {
  const sql = `UPDATE Pengguna SET 
    nama = ?, email = ?, pengalaman = ?, tentang = ?, alamat = ?, jenis_kelamin = ?, pekerjaan = ?, no_hp = ?, kata_sandi = ?, peran = ?
    WHERE id = ?`;

  const {
    nama,
    email,
    pengalaman,
    tentang,
    alamat,
    jenis_kelamin,
    pekerjaan,
    no_hp,
    kata_sandi,
    peran,
  } = data;

  try {
    const connection = await db.getDbConnection();
    await connection.execute(sql, [
      nama,
      email,
      pengalaman || null,
      tentang || null,
      alamat || null,
      jenis_kelamin || null,
      pekerjaan || null,
      no_hp || null,
      kata_sandi || null,
      peran || null,
      id,
    ]);
  } catch (error) {
    console.log("Error updating pengguna:", error);
    throw error;
  }
};

export const deletePengguna = async (id) => {
  const sql = "DELETE FROM Pengguna WHERE id = ?";

  try {
    const connection = await db.getDbConnection();
    const [result] = await connection.execute(sql, [id]);

    if (result.affectedRows === 0) {
      throw new Error("Pengguna tidak ditemukan");
    }
    return result;
  } catch (error) {
    console.error("Error deleting pengguna:", error);
    throw error;
  }
};

export const getPenggunaByEmail = async (email) => {
  try {
    const connection = await db.getDbConnection();
    const query = "SELECT * FROM Pengguna WHERE email = ?";
    const [rows] = await connection.execute(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.log("Error fetching pengguna by email: ", error);
    throw error;
  }
};

export const getJumlahPenggunaFromDB = async () => {
  try {
    const [rows] = await db
      .getDbConnection()
      .query("SELECT COUNT(*) AS pengguna_count FROM Pengguna");
    return rows[0].pengguna_count;
  } catch (error) {
    console.error("Error fetching Pengguna count:", error);
    throw error;
  }
};

export const getThreeLatestPengguna = async () => {
  try {
    // Mendapatkan koneksi dari pool
    const connection = await db.getDbConnection();

    // Melakukan query untuk mendapatkan 3 pengguna terbaru
    const [rows] = await connection.query('SELECT * FROM pengguna ORDER BY dibuat_pada DESC LIMIT 3');

    return rows;
  } catch (error) {
    console.error('Error fetching latest pengguna:', error);
    throw error;
  }
};

export const fetchUserSuggestions = async (role, excludeUserId) => {
  const query = `
    SELECT 
      p.nama AS profil_nama, 
      p.gambar AS profil_gambar, 
      u.nama AS pengguna_nama,
      u.id AS pengguna_id
    FROM Profil p
    INNER JOIN Pengguna u ON p.pengguna_id = u.id
    WHERE u.peran = ?  -- Filter berdasarkan peran
      AND u.id != ?  -- Exclude the logged-in user
    LIMIT 10
  `;
  try {
    const [users] = await db.getDbConnection().query(query, [role, excludeUserId]);  // Passing role and excludeUserId dynamically
    return users;
  } catch (error) {
    console.error("Error in UserModel:", error);
    throw error;
  }
};


