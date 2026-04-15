# Setup Instructions for Experience Management

## 1. Create Database Table

Buka phpMyAdmin di http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=travello_db&table=experiences

Jalankan SQL query berikut:

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
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_title (title),
    INDEX idx_company (company),
    INDEX idx_active (isActive),
    INDEX idx_featured (featured),
    INDEX idx_startDate (startDate),
    INDEX idx_order (`order`),
    INDEX idx_currentJob (currentJob),
    INDEX idx_type (type),
    FULLTEXT idx_search (title, description, company, position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 2. Backend Setup

Pastikan backend server berjalan di http://localhost:3000

## 3. Frontend Setup

Pastikan frontend berjalan di http://localhost:5173

## 4. Environment Variables

Tambahkan ke file `.env` di frontend:
```
VITE_API_URL=http://localhost:3000
```

## 5. Usage

### Admin Experience Management
- Buka http://localhost:5173/admin/landing/experience
- Login sebagai admin
- Tambah, edit, atau hapus experiences melalui modal

### Frontend Display
- Data akan muncul secara otomatis di experience section
- Carousel akan menampilkan experiences dari database
- Loading dan empty states sudah dihandle

## Features

### AdminExperiencePage.tsx
- CRUD operations melalui API
- Pagination support
- Image upload support
- Loading states
- Error handling dengan toast notifications

### experienceSection.tsx
- Dynamic data dari API
- Auto-rotating carousel
- Mobile responsive
- Loading dan empty states
- Smooth animations

## API Endpoints

- `GET /api/experiences` - Get all experiences (admin)
- `GET /api/experiences/active` - Get active experiences (public)
- `POST /api/experiences` - Create new experience
- `PUT /api/experiences/:id` - Update experience
- `DELETE /api/experiences/:id` - Delete experience

## Data Flow

1. Admin menambah experience melalui modal di AdminExperiencePage
2. Data dikirim ke backend API
3. Backend menyimpan ke MySQL database
4. Frontend experienceSection mengambil data dari API
5. Data ditampilkan di carousel secara dinamis
