const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',   
  port: 4000,                                               
  user: '3QDiR9H3m7wx4fU.root',                             
  password: 'root',                
  database: 'sistem_informasi_logistik',                   
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false          
  },
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  dateStrings: true,
  connectTimeout: 10000,
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('[DB] Koneksi berhasil');
    conn.release();
  } catch (err) {
    console.error('[DB] Gagal:', err.message);
  }
}

module.exports = { pool, testConnection };