// Script untuk extract data dari localStorage browser
// Jalankan ini di browser console pada halaman http://localhost:5173/admin/blog

console.log('=== Blog Data Extraction Script ===');
console.log('Instructions:');
console.log('1. Buka http://localhost:5173/admin/blog');
console.log('2. Buka Developer Console (F12)');
console.log('3. Copy dan paste script ini lalu tekan Enter');
console.log('');

// Extract data dari localStorage
const blogData = localStorage.getItem('admin_blog_articles');

if (blogData) {
    try {
        const parsedData = JSON.parse(blogData);
        console.log('Data berhasil di-extract!');
        console.log(`Jumlah artikel: ${parsedData.length}`);
        console.log('');
        console.log('Data lengkap:');
        console.log(JSON.stringify(parsedData, null, 2));
        console.log('');
        console.log('Copy JSON di atas dan simpan ke file blog-data.json');
        console.log('Kemudian jalankan: npm run migrate:blog -- --from-file');
    } catch (error) {
        console.error('Error parsing data:', error);
    }
} else {
    console.log('Tidak ada data blog di localStorage');
    console.log('Pastikan Anda sudah menambahkan artikel di halaman admin blog');
}

// Alternative: Export to file download
function downloadBlogData() {
    const blogData = localStorage.getItem('admin_blog_articles');
    if (blogData) {
        const dataStr = JSON.stringify(JSON.parse(blogData), null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'blog-data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        console.log('File blog-data.json telah di-download!');
    } else {
        console.log('Tidak ada data untuk di-download');
    }
}

console.log('');
console.log('Untuk download file otomatis, jalankan: downloadBlogData()');
