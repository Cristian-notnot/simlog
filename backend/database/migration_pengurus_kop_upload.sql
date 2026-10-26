CREATE TABLE IF NOT EXISTS pengurus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_lengkap VARCHAR(150) NOT NULL,
  nomor_telepon VARCHAR(30) NOT NULL,
  email VARCHAR(150) NOT NULL,
  angkatan VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_pengurus_angkatan (angkatan),
  INDEX idx_pengurus_nama (nama_lengkap)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS piket_dokumen_settings (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  ketua_nama VARCHAR(100) NULL,
  sekretaris_nama VARCHAR(100) NULL,
  kop_organisasi VARCHAR(255) NULL DEFAULT 'HIZBUL WATHAN UNIVERSITAS MUHAMMADIYAH SEMARANG',
  kop_unit VARCHAR(255) NULL DEFAULT 'BIDANG LOGISTIK · MAKO HW UNIMUS',
  kop_alamat VARCHAR(255) NULL,
  kop_kontak VARCHAR(255) NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO piket_dokumen_settings (id)
VALUES (1)
ON DUPLICATE KEY UPDATE id = VALUES(id);

SET @kop_name_exists = (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'piket_dokumen_settings'
    AND column_name = 'kop_document_name'
);
SET @kop_name_sql = IF(
  @kop_name_exists = 0,
  'ALTER TABLE piket_dokumen_settings ADD COLUMN kop_document_name VARCHAR(255) NULL',
  'SELECT 1'
);
PREPARE kop_name_statement FROM @kop_name_sql;
EXECUTE kop_name_statement;
DEALLOCATE PREPARE kop_name_statement;

SET @kop_path_exists = (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'piket_dokumen_settings'
    AND column_name = 'kop_document_path'
);
SET @kop_path_sql = IF(
  @kop_path_exists = 0,
  'ALTER TABLE piket_dokumen_settings ADD COLUMN kop_document_path VARCHAR(255) NULL',
  'SELECT 1'
);
PREPARE kop_path_statement FROM @kop_path_sql;
EXECUTE kop_path_statement;
DEALLOCATE PREPARE kop_path_statement;
