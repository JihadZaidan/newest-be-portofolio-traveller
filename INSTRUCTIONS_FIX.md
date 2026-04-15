# 🚨 PERBAIKAN ERROR EXPERIENCES - LANGKAH DEMI LANGKAH

## Masalah:
- Error 500: "Incorrect arguments to mysqld_stmt_execute"
- Tabel `experiences` belum ada di database

## ✅ SOLUSI:

### LANGKAH 1: Buat Tabel di phpMyAdmin
1. Buka: http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=travello_db
2. Copy SQL di bawah ini:
```sql
CREATE TABLE IF NOT EXISTS experiences (
    id VARCHAR(24) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    imageUrl VARCHAR(500),
    startDate DATE NOT NULL,
    endDate DATE,
    currentJob BOOLEAN DEFAULT FALSE,
    location VARCHAR(255) NOT NULL,
    type ENUM('full-time', 'part-time', 'freelance', 'internship', 'remote') DEFAULT 'full-time',
    department VARCHAR(255) DEFAULT '',
    achievements JSON,
    technologies JSON,
    responsibilities JSON,
    skills JSON,
    featured BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT TRUE,
    `order` INT DEFAULT 0,
    tags JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
3. Paste di SQL query editor dan klik "Go"

### LANGKAH 2: Restart Backend Server
```bash
cd c:\Users\ACER\workandshop\be-rizwords
npm start
```

### LANGKAH 3: Test Frontend
1. Buka: http://localhost:5173/admin/landing/experience
2. Login sebagai admin
3. Tambah experience baru

## 🔍 Verifikasi:
- Backend berjalan di port 55435
- Tabel experiences ada di database
- Frontend bisa menambah/edit/delete experiences

## 📞 Jika Masih Error:
1. Pastikan MySQL/MariaDB berjalan
2. Cek log backend di terminal
3. Verify database connection di .env
