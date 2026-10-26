import React, { useEffect, useState } from 'react';
import { Download, FileText, Loader2, Upload } from 'lucide-react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Button from '../components/UI/Button';
import api from '../api/axios';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function PiketDocumentSettings() {
  const [currentFileName, setCurrentFileName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/operasional/piket/dokumen')
      .then(({ data }) => {
        if (active) setCurrentFileName(data.kop_document_name || '');
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Dokumen kop gagal dimuat.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const uploadDocument = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!file) {
      setError('Pilih dokumen Word yang akan diunggah.');
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');
    const formData = new FormData();
    formData.append('dokumen', file);

    try {
      const { data } = await api.put('/operasional/piket/dokumen/kop', formData);
      setCurrentFileName(data.fileName);
      setFile(null);
      form.reset();
      setNotice(data.message || 'Dokumen kop berhasil diunggah.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Dokumen kop gagal diunggah.');
    } finally {
      setSaving(false);
    }
  };

  const downloadDocument = async () => {
    setDownloading(true);
    setError('');
    try {
      const { data } = await api.get('/operasional/piket/dokumen/kop-file', {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = currentFileName || 'Kop_Surat.docx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Dokumen kop gagal diunduh.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DashboardLayout
      title="Kop Surat Piket"
      subtitle="Unggah dan unduh dokumen kop surat dalam format Microsoft Word."
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
          Memuat dokumen kop...
        </div>
      ) : (
        <section className="max-w-3xl rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
              <FileText size={19} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Dokumen Kop Surat</h2>
              <p className="text-xs text-slate-500">Format yang didukung: DOC atau DOCX, maksimal 10 MB.</p>
            </div>
          </div>

          <form onSubmit={uploadDocument}>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Pilih dokumen Word
              <input
                type="file"
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0] || null;
                  setFile(selectedFile);
                  setError(
                    selectedFile && selectedFile.size > MAX_FILE_SIZE
                      ? 'Ukuran dokumen tidak boleh lebih dari 10 MB.'
                      : ''
                  );
                }}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm"
              />
            </label>

            {currentFileName && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Dokumen yang tersimpan</p>
                  <p className="break-all text-sm font-medium text-slate-800">{currentFileName}</p>
                </div>
                <Button type="button" variant="secondary" disabled={downloading} onClick={downloadDocument}>
                  {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  {downloading ? 'Mengunduh...' : 'Unduh dokumen'}
                </Button>
              </div>
            )}

            <Button type="submit" disabled={saving || !file || file.size > MAX_FILE_SIZE} className="mt-5">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {saving ? 'Mengunggah...' : 'Unggah Kop Surat'}
            </Button>
          </form>
        </section>
      )}
    </DashboardLayout>
  );
}
