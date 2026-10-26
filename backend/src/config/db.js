const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3QDiR9H3m7wx4fU.root',
  password: 'UWkh5EBrgtu2O6uj',
  database: 'sistem_informasi_logistik',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  dateStrings: true,
  connectTimeout: 15000,
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('[DB] Koneksi BERHASIL ke TiDB Cloud');
    conn.release();
  } catch (err) {
    console.error('[DB] GAGAL konek:', err.message);
  }
}

module.exports = { pool, testConnection };