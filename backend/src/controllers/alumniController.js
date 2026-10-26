const { pool } = require('../config/db');

const handler = (fn) => async (req, res, next) => {
  try { await fn(req, res, next); } catch (e) { next(e); }
};

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

function validate(body) {
  const nama = typeof body.nama_lengkap === 'string' ? body.nama_lengkap.trim() : '';
  const telp = typeof body.nomor_telepon === 'string' ? body.nomor_telepon.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const angkatan =
    typeof body.angkatan === 'string'
      ? body.angkatan.trim()
      : typeof body.angkatan === 'number'
      ? String(body.angkatan)
      : '';

  if (nama.length < 3 || nama.length > 150) throw httpError(400, 'Nama lengkap wajib diisi (3–150 karakter).');
  if (!/^[0-9+\-\s]{8,30}$/.test(telp)) throw httpError(400, 'Nomor telepon tidak valid.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 150) throw httpError(400, 'Email tidak valid.');
  if (!angkatan || angkatan.length > 100) {
    throw httpError(400, 'Angkatan tidak valid.');
  }
  return [nama, telp, email, angkatan];
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
    `SELECT * FROM alumni ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
     ORDER BY angkatan DESC, nama_lengkap ASC`,
    params
  );
  res.set('Cache-Control', 'private, no-store');
  res.json(rows);
});

exports.create = handler(async (req, res) => {
  const values = validate(req.body);
  const [result] = await pool.query(
    'INSERT INTO alumni (nama_lengkap, nomor_telepon, email, angkatan) VALUES (?, ?, ?, ?)',
    values
  );
  res.status(201).json({ id: result.insertId, message: 'Data alumni berhasil ditambahkan.' });
});

exports.update = handler(async (req, res) => {
  const values = validate(req.body);
  const [result] = await pool.query(
    'UPDATE alumni SET nama_lengkap = ?, nomor_telepon = ?, email = ?, angkatan = ? WHERE id = ?',
    [...values, req.params.id]
  );
  if (!result.affectedRows) throw httpError(404, 'Data alumni tidak ditemukan.');
  res.json({ message: 'Data alumni berhasil diperbarui.' });
});

exports.remove = handler(async (req, res) => {
  const [result] = await pool.query('DELETE FROM alumni WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) throw httpError(404, 'Data alumni tidak ditemukan.');
  res.json({ message: 'Data alumni berhasil dihapus.' });
});