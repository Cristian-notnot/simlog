const { pool } = require('../config/db');

const handler = (fn) => async (req, res, next) => {
  try { await fn(req, res, next); } catch (error) { next(error); }
};

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validate(body) {
  const nama = typeof body.nama_lengkap === 'string' ? body.nama_lengkap.trim() : '';
  const telepon = typeof body.nomor_telepon === 'string' ? body.nomor_telepon.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const angkatan = typeof body.angkatan === 'string' ? body.angkatan.trim() : '';

  if (nama.length < 3 || nama.length > 150) throw httpError(400, 'Nama lengkap wajib diisi (3–150 karakter).');
  if (!/^[0-9+\-\s]{8,30}$/.test(telepon)) throw httpError(400, 'Nomor telepon tidak valid.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 150) throw httpError(400, 'Email tidak valid.');
  if (!angkatan || angkatan.length > 100) throw httpError(400, 'Angkatan tidak valid.');
  return [nama, telepon, email, angkatan];
}

exports.list = handler(async (req, res) => {
  const { search, angkatan } = req.query;
  const where = [];
  const params = [];
  if (search) {
    where.push('(nama_lengkap LIKE ? OR email LIKE ? OR nomor_telepon LIKE ? OR angkatan LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (angkatan) {
    where.push('angkatan LIKE ?');
    params.push(`%${angkatan}%`);
  }
  const [rows] = await pool.query(
    `SELECT * FROM pengurus ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY angkatan DESC, nama_lengkap ASC`,
    params
  );
  res.set('Cache-Control', 'private, no-store');
  res.json(rows);
});

exports.create = handler(async (req, res) => {
  const values = validate(req.body);
  const [result] = await pool.query(
    'INSERT INTO pengurus (nama_lengkap, nomor_telepon, email, angkatan) VALUES (?, ?, ?, ?)',
    values
  );
  res.status(201).json({ id: result.insertId, message: 'Data pengurus berhasil ditambahkan.' });
});

exports.update = handler(async (req, res) => {
  const values = validate(req.body);
  const [result] = await pool.query(
    'UPDATE pengurus SET nama_lengkap = ?, nomor_telepon = ?, email = ?, angkatan = ? WHERE id = ?',
    [...values, req.params.id]
  );
  if (!result.affectedRows) throw httpError(404, 'Data pengurus tidak ditemukan.');
  res.json({ message: 'Data pengurus berhasil diperbarui.' });
});

exports.remove = handler(async (req, res) => {
  const [result] = await pool.query('DELETE FROM pengurus WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) throw httpError(404, 'Data pengurus tidak ditemukan.');
  res.json({ message: 'Data pengurus berhasil dihapus.' });
});
