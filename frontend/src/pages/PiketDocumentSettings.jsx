import React, { useEffect, useState } from 'react';
import { FileText, Save, Users } from 'lucide-react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Button from '../components/UI/Button';
import api from '../api/axios';

const defaults = {
  ketua_nama: '',
  sekretaris_nama: '',
  kop_organisasi: 'HIZBUL WATHAN UNIVERSITAS MUHAMMADIYAH SEMARANG',
  kop_unit: 'BIDANG LOGISTIK · MAKO HW UNIMUS',
  kop_alamat: '',
  kop_kontak: '',
};

const inputClass =
  'w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';

const normalizeSettings = (data) =>
  Object.fromEntries(
    Object.keys(defaults).map((field) => [field, data[field] ?? defaults[field]])
  );

export default function PiketDocumentSettings() {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/operasional/piket/dokumen')
      .then(({ data }) => {
        if (active) setSettings(normalizeSettings(data));
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Pengaturan dokumen gagal dimuat.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const setField = (field, value) =>
    setSettings((current) => ({ ...current, [field]: value }));

  const saveSection = async (section) => {
    setSaving(section);
    setError('');
    setNotice('');
    const isPengurus = section === 'pengurus';
    const fields = isPengurus
      ? ['ketua_nama', 'sekretaris_nama']
      : ['kop_organisasi', 'kop_unit', 'kop_alamat', 'kop_kontak'];
    try {
      const { data } = await api.put(
        `/operasional/piket/dokumen/${section}`,
        Object.fromEntries(fields.map((field) => [field, settings[field]]))
      );
      setNotice(data.message || 'Pengaturan berhasil disimpan.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Pengaturan gagal disimpan.');
    } finally {
      setSaving('');
    }
  };

  return (
    <DashboardLayout
      title="Pengaturan Dokumen Piket"
      subtitle="Kelola data pengurus dan kop surat secara terpisah dari verifikasi laporan."
    >
      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {notice}
        </div>
      )}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Memuat pengaturan dokumen...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                <Users size={19} />
              </span>
              <div>
                <h2 className="font-semibold text-slate-900">Data Pengurus</h2>
                <p className="text-xs text-slate-500">Ditampilkan pada bagian tanda tangan dokumen Word.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Nama Ketua Bidang Logistik
                <input
                  maxLength={100}
                  value={settings.ketua_nama}
                  onChange={(event) => setField('ketua_nama', event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Nama Sekretaris Bidang Logistik
                <input
                  maxLength={100}
                  value={settings.sekretaris_nama}
                  onChange={(event) => setField('sekretaris_nama', event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
            <Button type="button" disabled={saving !== ''} onClick={() => saveSection('pengurus')} className="mt-5">
              <Save size={16} />
              {saving === 'pengurus' ? 'Menyimpan...' : 'Simpan Data Pengurus'}
            </Button>
          </section>

          <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                <FileText size={19} />
              </span>
              <div>
                <h2 className="font-semibold text-slate-900">Kop Surat</h2>
                <p className="text-xs text-slate-500">Diatur tersendiri dan digunakan pada dokumen Word.</p>
              </div>
            </div>
            <div className="grid gap-4">
              {[
                ['kop_organisasi', 'Nama organisasi'],
                ['kop_unit', 'Unit / bidang'],
                ['kop_alamat', 'Alamat'],
                ['kop_kontak', 'Kontak (telepon/email)'],
              ].map(([field, label]) => (
                <label key={field} className="grid gap-1.5 text-sm font-medium text-slate-700">
                  {label}
                  <input
                    maxLength={255}
                    value={settings[field]}
                    onChange={(event) => setField(field, event.target.value)}
                    className={inputClass}
                  />
                </label>
              ))}
            </div>
            <Button type="button" disabled={saving !== ''} onClick={() => saveSection('kop')} className="mt-5">
              <Save size={16} />
              {saving === 'kop' ? 'Menyimpan...' : 'Simpan Kop Surat'}
            </Button>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}
