const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatDate = (value) => {
  if (!value) return '-';
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const exportPiketToDoc = (rows, settings = {}) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Belum ada data pelaksanaan piket untuk diekspor.');
  }

  const tableRows = rows
    .map(
      (row, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(formatDate(row.tanggal || row.created_at))}</td>
          <td>${escapeHtml(row.nama_bidang || '-')}</td>
          <td>${escapeHtml(row.nama_pengisi || '-')}</td>
          <td>${escapeHtml(row.status || '-')}</td>
          <td>${Number(row.status_verifikasi) ? 'Terverifikasi' : 'Menunggu verifikasi'}</td>
          <td>${escapeHtml(row.diverifikasi_nama || '-')}</td>
          <td>${escapeHtml(row.catatan || '-')}</td>
        </tr>`
    )
    .join('');
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const kopOrganisasi = settings.kop_organisasi || 'HIZBUL WATHAN UNIVERSITAS MUHAMMADIYAH SEMARANG';
  const kopUnit = settings.kop_unit || 'BIDANG LOGISTIK · MAKO HW UNIMUS';
  const kopAlamat = settings.kop_alamat || '';
  const kopKontak = settings.kop_kontak || '';
  const html = `<!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>Laporan Piket Mako HW UNIMUS</title>
        <style>
          @page { size: landscape; margin: 1.5cm; }
          body { font-family: Arial, sans-serif; color: #1f2937; font-size: 10pt; }
          .letterhead { text-align: center; line-height: 1.35; }
          .letterhead .organization { font-size: 13pt; font-weight: bold; }
          .letterhead .division { font-size: 12pt; font-weight: bold; }
          .rule { border: 0; border-top: 3px solid #064e3b; margin: 10px 0 2px; }
          .rule-thin { border: 0; border-top: 1px solid #064e3b; margin: 0 0 22px; }
          h1 { text-align: center; font-size: 14pt; margin: 0 0 5px; }
          .date { text-align: center; margin: 0 0 18px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #64748b; padding: 6px; vertical-align: top; }
          th { background: #e7f3ee; text-align: center; }
          .signatures { margin: 35px 0 0 auto; width: 48%; }
          .signatures td { border: 0; text-align: center; width: 50%; }
          .signature-space { height: 65px; }
          .signature-name { font-weight: bold; text-decoration: underline; }
        </style>
      </head>
      <body>
        <header class="letterhead">
          <div class="organization">${escapeHtml(kopOrganisasi)}</div>
          <div class="division">${escapeHtml(kopUnit)}</div>
          ${kopAlamat ? `<div>${escapeHtml(kopAlamat)}</div>` : ''}
          ${kopKontak ? `<div>${escapeHtml(kopKontak)}</div>` : ''}
        </header>
        <hr class="rule">
        <hr class="rule-thin">
        <h1>LAPORAN PELAKSANAAN PIKET MAKO</h1>
        <p class="date">Dicetak pada ${escapeHtml(today)}</p>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Tanggal</th>
              <th>Bidang</th>
              <th>Nama Petugas</th>
              <th>Status</th>
              <th>Verifikasi</th>
              <th>Diverifikasi oleh</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
        <table class="signatures">
          <tr><td colspan="2">Semarang, ${escapeHtml(today)}<br>Bidang Logistik HW UNIMUS</td></tr>
          <tr>
            <td>
              Ketua Bidang
              <div class="signature-space"></div>
              <span class="signature-name">${escapeHtml(settings.ketua_nama || '................................')}</span>
            </td>
            <td>
              Sekretaris
              <div class="signature-space"></div>
              <span class="signature-name">${escapeHtml(settings.sekretaris_nama || '................................')}</span>
            </td>
          </tr>
        </table>
      </body>
    </html>`;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Laporan_Piket_Mako_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
