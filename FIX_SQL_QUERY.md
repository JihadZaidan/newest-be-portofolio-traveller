# 🔧 PERBAIKAN SQL QUERY EXPERIENCE

## ❌ Masalah:
Error di line 356 experience.controller.js:
```javascript
`SELECT * FROM experiences WHERE ${whereClause} ORDER BY \`order\` ASC, startDate DESC LIMIT ? OFFSET ?`
```

## ✅ Solusi:
Ganti dengan query yang benar:

### File: `be-rizwords/src/controllers/experience.controller.js`
### Line: 356

**GANTI DARI:**
```javascript
`SELECT * FROM experiences WHERE ${whereClause} ORDER BY \`order\` ASC, startDate DESC LIMIT ? OFFSET ?`
```

**GANTI KE:**
```javascript
`SELECT * FROM experiences WHERE ${whereClause} ORDER BY \`order\` ASC, startDate DESC LIMIT ${limitNum} OFFSET ${offset}`
```

### Atau gunakan placeholder yang benar:
```javascript
`SELECT * FROM experiences WHERE ${whereClause} ORDER BY \`order\` ASC, startDate DESC LIMIT ? OFFSET ?`
```

## 🚀 Setelah Perbaikan:

1. **Restart Backend:**
```bash
cd c:\Users\ACER\workandshop\be-rizwords
npm start
```

2. **Test API Active Experiences:**
```bash
curl http://localhost:55435/api/experiences/active
```

3. **Test Frontend:**
- Buka http://localhost:5173
- Lihat "My Experience" section
- Harus muncul data dari database

## 📊 Expected Result:
Data yang muncul harus sesuai dengan database:
- exp_001: Ads Quality Rater (Welocalize)
- exp_002: Search Quality Improvement Lead (Gini Talent)
- exp_003: Copywriter (Self Employed)

## 🎯 Tujuan:
✅ ExperienceSection.tsx menampilkan data REAL dari database
✅ Tidak lagi menggunakan in-memory data
✅ Synchronized dengan phpMyAdmin
