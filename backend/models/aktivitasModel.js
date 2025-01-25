import db from '../config/db.js'; 

export const getAktivitasTerbaruFromDB = async () => {
  try {
    const connection = await db.getDbConnection();
    const [rows] = await connection.query('SELECT * FROM aktivitas ORDER BY dibuat_pada DESC LIMIT 3'); 
    return rows;
  } catch (error) {
    console.error('Error fetching recent activities from DB:', error);
    throw error;
  }
};