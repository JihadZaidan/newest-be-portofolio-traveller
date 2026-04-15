# 🔧 SQL QUERY FIX - EXPERIENCE CONTROLLER

## ❌ Current Error:
```javascript
// LINE 356-358 di experience.controller.js
const [rows] = await pool.execute(
    `SELECT * FROM experiences WHERE ${whereClause} ORDER BY \`order\` ASC, startDate DESC LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
);
```

## ✅ Manual Fix Required:

### File to Edit:
`c:\Users\ACER\workandshop\be-rizwords\src\controllers\experience.controller.js`

### Line 356-358:
**GANTI kode di atas dengan:**

```javascript
const [rows] = await pool.execute(
    `SELECT * FROM experiences WHERE ${whereClause} ORDER BY \`order\` ASC, startDate DESC LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
);
```

**CATATAN:**
- Backtick sebelum `order` sudah benar: \`order\`
- Masalahnya adalah placeholder `?` - harus tetap `?` untuk parameter
- Query seharusnya berfungsi dengan benar

## 🚀 Setelah Fix:

### 1. Restart Backend:
```bash
cd c:\Users\ACER\workandshop\be-rizwords
npm start
```

### 2. Test API:
```bash
curl http://localhost:55435/api/experiences/active
```

### 3. Verify Frontend:
- Buka http://localhost:5173
- Scroll ke "My Experience" section
- Harus muncul 3 experiences dari database

## 📊 Expected Data:
1. **exp_001** - Ads Quality Rater (Welocalize)
2. **exp_002** - Search Quality Improvement Lead (Gini Talent)  
3. **exp_003** - Copywriter (Self Employed)

## 🎯 Goal:
✅ ExperienceSection.tsx menampilkan data REAL dari database
✅ Data synchronized dengan phpMyAdmin
✅ Tidak ada lagi in-memory data

## 🔍 Debug Steps:
Jika masih error:
1. Cek console log backend
2. Verify query SQL yang dihasilkan
3. Test query langsung di phpMyAdmin
4. Pastikan parameter terkirim dengan benar
