import db from "../config/db.js";

export const addAnggotaGrup = async (grup_id, pengguna_id) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("INSERT INTO AnggotaGrup (grup_id, pengguna_id) VALUES (?, ?)", [
        grup_id,
        pengguna_id,
      ]);
    return result.affectedRows > 0;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Anggota sudah ada dalam grup ini");
    }
    throw new Error("Gagal menambahkan anggota: " + error.message);
  }
};

export const getAnggotaByGrup = async (grup_id) => {
  try {
    const [anggota] = await db
      .getDbConnection()
      .query("SELECT pengguna_id FROM AnggotaGrup WHERE grup_id = ?", [
        grup_id,
      ]);
    return anggota;
  } catch (error) {
    throw new Error("Gagal mengambil anggota: " + error.message);
  }
};

export const getAnggotaByGrupAndPengguna = async (grup_id, pengguna_id) => {
  try {
    const [anggota] = await db
      .getDbConnection()
      .query(
        "SELECT * FROM AnggotaGrup WHERE grup_id = ? AND pengguna_id = ?",
        [grup_id, pengguna_id]
      );
    return anggota.length > 0;
  } catch (error) {
    throw new Error("Gagal mengecek anggota: " + error.message);
  }
};

export const deleteAnggotaGrup = async (grup_id, pengguna_id) => {
  try {
    const [result] = await db
      .getDbConnection()
      .query("DELETE FROM AnggotaGrup WHERE grup_id = ? AND pengguna_id = ?", [
        grup_id,
        pengguna_id,
      ]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error("Gagal menghapus anggota: " + error.message);
  }
};

export const getPesanById = async (grup_id, pesan_id) => {
  try {
    const [pesan] = await db
      .getDbConnection()
      .query("SELECT * FROM GrupChat WHERE grup_id = ? AND id = ?", [
        grup_id,
        pesan_id,
      ]);
    return pesan.length > 0 ? pesan[0] : null;
  } catch (error) {
    throw new Error("Gagal mengambil pesan: " + error.message);
  }
};
