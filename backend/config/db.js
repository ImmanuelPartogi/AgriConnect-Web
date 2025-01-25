import mysql from 'mysql2/promise';

let pool;

const connectDB = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'db_petani_pintar',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('Database pool created successfully');
  }
  return pool;
};

const getDbConnection = () => {
  return connectDB(); 
};

export default { connectDB, getDbConnection };
