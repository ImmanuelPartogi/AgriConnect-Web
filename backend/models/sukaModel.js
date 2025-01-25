import db from "../config/db.js";

// Tambahkan suka
export const addSuka = async (penggunaId, produkId) => {
    try {
        const pool = db.getDbConnection();
        const [result] = await pool.query(
            "INSERT INTO Suka (pengguna_id, produk_id) VALUES (?, ?)",
            [penggunaId, produkId]
        );
        return {
            id: result.insertId,
            penggunaId,
            produkId,
        };
    } catch (error) {
        throw new Error("Error while adding suka: " + error.message);
    }
};

// Hapus suka
export const removeSuka = async (penggunaId, produkId) => {
    try {
        const pool = db.getDbConnection();
        const [result] = await pool.query(
            "DELETE FROM Suka WHERE pengguna_id = ? AND produk_id = ?",
            [penggunaId, produkId]
        );

        if (result.affectedRows === 0) {
            throw new Error("Like tidak ditemukan");
        }
    } catch (error) {
        throw new Error("Error while removing suka: " + error.message);
    }
};

// Ambil semua suka berdasarkan pengguna
export const getSukaByPengguna = async (penggunaId) => {
    try {
        const pool = db.getDbConnection();
        const [rows] = await pool.query(
            `SELECT Suka.*, Produk.nama, Produk.deskripsi, Produk.harga
         FROM Suka
         INNER JOIN Produk ON Suka.produk_id = Produk.id
         WHERE Suka.pengguna_id = ?`,
            [penggunaId]
        );
        return rows;
    } catch (error) {
        throw new Error("Error fetching suka by pengguna: " + error.message);
    }
};

// Hitung total suka pada sebuah produk
export const countSukaByProduk = async (produkId) => {
    try {
        const pool = db.getDbConnection();
        const [rows] = await pool.query(
            "SELECT COUNT(*) AS total FROM Suka WHERE produk_id = ?",
            [produkId]
        );
        return rows[0].total;
    } catch (error) {
        throw new Error("Error counting suka by produk: " + error.message);
    }
};

export const getSukaByPenggunaAndProduk = async (penggunaId, produkId) => {
    try {
        const pool = db.getDbConnection();
        const [rows] = await pool.query(
            "SELECT * FROM Suka WHERE pengguna_id = ? AND produk_id = ?",
            [penggunaId, produkId]
        );
        return rows;
    } catch (error) {
        throw new Error("Error fetching suka by pengguna and produk: " + error.message);
    }
};