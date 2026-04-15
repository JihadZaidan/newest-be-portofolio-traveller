# Migrate All Blog Data from Frontend to Database

## 🚨 Complete Data Migration Guide

Follow these steps to migrate ALL blog articles from your frontend localStorage to the database.

## Step 1: Extract Data from Frontend

### Method A: Browser Console (Recommended)

1. **Buka browser** dan navigasi ke: `http://localhost:5173/admin/blog`
2. **Buka Developer Console** (tekan F12)
3. **Copy dan paste script ini** di console:

```javascript
// Extract dan download data otomatis
const blogData = localStorage.getItem('admin_blog_articles');
if (blogData) {
    const dataStr = JSON.stringify(JSON.parse(blogData), null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'blog-data.json');
    linkElement.click();
    console.log('✅ File blog-data.json berhasil di-download!');
} else {
    console.log('❌ Tidak ada data di localStorage');
}
```

4. **Tekan Enter** - file `blog-data.json` akan otomatis di-download
5. **Pindahkan file** ke folder `c:\Users\ACER\workandshop\`

### Method B: Manual Copy

1. Buka `http://localhost:5173/admin/blog`
2. Buka Developer Console (F12)
3. Jalankan: `localStorage.getItem('admin_blog_articles')`
4. Copy outputnya
5. Buat file `blog-data.json` dan paste data di dalamnya

## Step 2: Verify Extracted Data

Pastikan file `blog-data.json` memiliki struktur seperti ini:

```json
[
  {
    "id": 1,
    "cover": "/placeholder-image.png",
    "title": "Judul Artikel",
    "category": "Travel Tips",
    "status": "publish",
    "content": "<p>Isi artikel dalam format HTML...</p>"
  }
]
```

## Step 3: Run Migration

### Option 1: Replace All Data (Default)

```bash
npm run migrate:blog:file
```

### Option 2: Merge with Existing Data

```bash
npm run migrate:blog:merge
```

### Option 3: Use Sample Data

```bash
npm run migrate:blog
```

## Step 4: Verify Migration

### Check Database

1. **Buka phpMyAdmin**: http://localhost/phpmyadmin
2. **Navigasi ke**: `travello_db` → `blog_articles`
3. **Verify**: Semua artikel seharusnya ada di tabel

### Check via Command

```bash
npm run migrate:blog:help
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run migrate:blog` | Use sample data |
| `npm run migrate:blog:file` | Use data from blog-data.json (replace) |
| `npm run migrate:blog:merge` | Use data from blog-data.json (merge) |
| `npm run migrate:blog:clear` | Clear all blog articles |
| `npm run migrate:blog:help` | Show help |

## 🔍 Troubleshooting

### No Data Found
```
Error: ENOENT: no such file, open 'blog-data.json'
```
**Solution**: Pastikan file `blog-data.json` ada di folder yang benar

### Invalid JSON
```
Error: Unexpected token in JSON at position...
```
**Solution**: Validasi format JSON di file `blog-data.json`

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: 
- Pastikan MySQL server running
- Check kredensial di `migrate-blog-data.js`

### Missing Fields
Script akan otomatis handle missing fields:
- **Missing title**: Skip artikel (warning)
- **Missing cover**: Use `/placeholder-image.png`
- **Missing category**: Use `Uncategorized`
- **Missing status**: Use `draft`
- **Missing content**: Use `<p>No content available</p>`

## 📊 Migration Report

Setelah migration selesai, script akan menampilkan:

```
✅ Connected to MySQL database successfully
✅ Inserting X blog articles...
✅ Inserted article: "Judul Artikel 1" (ID: 1)
✅ Inserted article: "Judul Artikel 2" (ID: 2)
✅ Total articles in database: X

Inserted Articles:
==================
ID: 1
Title: Judul Artikel 1
Category: Travel Tips
Status: publish
Created: 2024-01-15 10:30:00
---
```

## 🔄 Next Steps

1. **Update Frontend**: Modifikasi frontend untuk fetch data dari database
2. **Create API**: Buat API endpoints untuk CRUD operations
3. **Test Integration**: Test admin panel dengan data dari database
4. **Remove localStorage**: Hapus dependency localStorage setelah migration

## 📝 Notes

- **Backup**: Selalu backup database sebelum migration
- **Validation**: Script otomatis validasi data structure
- **Error Handling**: Missing fields akan di-handle dengan default values
- **Merge vs Replace**: Pilih opsi yang sesuai dengan kebutuhan

## 🆘 Support

Jika mengalami masalah:
1. Check error messages carefully
2. Verify file locations and permissions
3. Ensure MySQL server is running
4. Review data structure in blog-data.json
