import React, { useCallback, useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Button from '../components/UI/Button';
import api from '../api/axios';
import { exportToExcel } from '../utils/exportToExcel';

const emptyForm = {
  nama_lengkap: '',
  nomor_telepon: '',
  email: '',
  angkatan: '',
};

const inputClass =
  'w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';

export default function AlumniManager() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [angkatanFilter, setAngkatanFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/alumni', {
        params: {
          search: search.trim() || undefined,
          angkatan: angkatanFilter || undefined,
        },
      });
      setRows(data);
      setError('');
    } catch (requestError) {
      setRows([]);
      setError(
        requestError.response?.data?.message || 'Data alumni gagal dimuat.'
      );
    } finally {
      setLoading(false);
    }
  }, [search, angkatanFilter]);

  // Tunda pencarian 300 ms agar tidak memanggil server di setiap ketukan.
  useEffect(() => {
    const timer = setTimeout(loadAlumni, 300);
    return () => clearTimeout(timer);
  }, [loadAlumni]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(timeout);
  }, [notice]);

  const setField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEditing(item) {
    setEditingId(item.id);
    setForm({
      nama_lengkap: item.nama_lengkap,
      nomor_telepon: item.nomor_telepon,
      email: item.email,
      angkatan: item.angkatan,
    });
    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const path = `/admin/alumni${editingId ? `/${editingId}` : ''}`;
      const { data } = await api[editingId ? 'put' : 'post'](path, form);
      setNotice(data.message || 'Data alumni berhasil disimpan.');
      resetForm();
      await loadAlumni();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Data alumni gagal disimpan.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeAlumni(item) {
    if (!window.confirm(`Hapus data alumni "${item.nama_lengkap}"?`)) return;
    setError('');
    setNotice('');
    try {
      const { data } = await api.delete(`/admin/alumni/${item.id}`);
      if (editingId === item.id) resetForm();
      setNotice(data.message || 'Data alumni berhasil dihapus.');
      await loadAlumni();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Data alumni gagal dihapus.'
      );
    }
  }

  function handleExport() {
    exportToExcel(
      rows.map((item, index) => ({
        No: index + 1,
        'Nama Lengkap': item.nama_lengkap,
        'Nomor Telepon': item.nomor_telepon,
        Email: item.email,
        Angkatan: item.angkatan,
      })),
      'Data_Alumni_HW_UNIMUS'
    );
  }

  return (
    <DashboardLayout
      title="History Alumni"
      subtitle="Data kontak alumni HW UNIMUS. Hanya dapat dilihat oleh admin."
    >
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {notice}
        </div>
      )}

      <form
        onSubmit={submit}
        className="mb-8 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
            {editingId ? <Pencil size={19} /> : <Plus size={20} />}
          </span>
          <h2 className="font-semibold text-slate-900">
            {editingId ? 'Ubah data alumni' : 'Tambah alumni'}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
            Nama lengkap
            <input
              required
              minLength={3}
              maxLength={150}
              autoComplete="off"
              value={form.nama_lengkap}
              onChange={(e) => setField('nama_lengkap', e.target.value)}
              placeholder="Masukkan nama lengkap"
              className={inputClass}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Nomor telepon
            <input
              required
              type="tel"
              inputMode="tel"
              maxLength={30}
              autoComplete="off"
              value={form.nomor_telepon}
              onChange={(e) => setField('nomor_telepon', e.target.value)}
              placeholder="Contoh: 081234567890"
              className={inputClass}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Email
            <input
              required
              type="email"
              maxLength={150}
              autoComplete="off"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="charlycristian@email.com"
              className={inputClass}
            />
          </label>
<label className="grid gap-1.5 text-sm font-medium text-slate-700">
  Angkatan
  <input
    required
    type="text"
    maxLength={100}
    autoComplete="off"
    value={form.angkatan}
    onChange={(e) => setField('angkatan', e.target.value)}
    placeholder="Contoh: Sahadya 2024"
    className={inputClass}
  />
</label>

        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving
              ? 'Menyimpan...'
              : editingId
              ? 'Simpan perubahan'
              : 'Tambah alumni'}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              <X size={16} /> Batal mengubah
            </Button>
          )}
        </div>
      </form>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau nomor telepon..."
            aria-label="Cari alumni"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <input
          type="text"
          maxLength={100}
          value={angkatanFilter}
          onChange={(e) => setAngkatanFilter(e.target.value)}
          placeholder="Filter angkatan"
          aria-label="Filter angkatan"
          className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
        <button
          type="button"
          onClick={handleExport}
          disabled={rows.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <FileSpreadsheet size={16} />
          Ekspor Excel
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-[0_10px_30px_rgba(21,78,66,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-800 text-left text-white">
                {['Nama lengkap', 'Nomor telepon', 'Email', 'Angkatan', 'Aksi'].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Memuat data alumni...
                    </span>
                  </td>
                </tr>
              )}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    {search || angkatanFilter
                      ? 'Tidak ada alumni yang cocok dengan pencarian.'
                      : 'Belum ada data alumni. Tambahkan alumni pertama lewat formulir di atas.'}
                  </td>
                </tr>
              )}

              {!loading &&
                rows.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-emerald-50 transition odd:bg-white even:bg-emerald-50/50 last:border-0 hover:bg-amber-50"
                  >
                    <td className="px-5 py-3 font-medium text-slate-800">
                      {item.nama_lengkap}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-slate-700">
                      {item.nomor_telepon}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{item.email}</td>
                    <td className="px-5 py-3 text-slate-700">{item.angkatan}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEditing(item)}
                          aria-label={`Ubah ${item.nama_lengkap}`}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeAlumni(item)}
                          aria-label={`Hapus ${item.nama_lengkap}`}
                          className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && rows.length > 0 && (
        <p className="mt-3 text-xs text-slate-500">{rows.length} alumni ditampilkan</p>
      )}
    </DashboardLayout>
  );
}
