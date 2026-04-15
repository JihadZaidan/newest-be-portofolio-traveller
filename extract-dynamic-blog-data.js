const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'travello_db',
    charset: 'utf8mb4'
};

// Function to extract data from localStorage file
function extractFromLocalStorageFile() {
    const localStorageFile = path.join(__dirname, 'localstorage-backup.json');
    
    if (fs.existsSync(localStorageFile)) {
        try {
            const data = fs.readFileSync(localStorageFile, 'utf8');
            const localStorageData = JSON.parse(data);
            const blogData = localStorageData['admin_blog_articles'];
            
            if (blogData) {
                console.log(`✅ Found ${blogData.length} articles in localStorage backup`);
                return blogData;
            }
        } catch (error) {
            console.error('Error reading localStorage backup:', error);
        }
    }
    
    // Try to read from blog-data.json (extracted manually)
    const blogDataFile = path.join(__dirname, 'blog-data.json');
    if (fs.existsSync(blogDataFile)) {
        try {
            const data = fs.readFileSync(blogDataFile, 'utf8');
            const blogData = JSON.parse(data);
            console.log(`✅ Found ${blogData.length} articles in blog-data.json`);
            return blogData;
        } catch (error) {
            console.error('Error reading blog-data.json:', error);
        }
    }
    
    console.log('❌ No blog data found. Please extract data from localStorage first.');
    return null;
}

// Function to create localStorage backup file
function createLocalStorageBackup() {
    console.log(`
📋 How to Extract Data from Frontend:

1. Buka browser dan navigasi ke: http://localhost:5173/admin/blog
2. Buka Developer Console (F12)
3. Jalankan script ini di console:

localStorageBackup = {};
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    localStorageBackup[key] = localStorage.getItem(key);
}
console.log(JSON.stringify(localStorageBackup));

4. Copy outputnya dan simpan sebagai file: localstorage-backup.json
5. Letakkan file di folder: c:\\Users\\ACER\\workandshop\\
6. Jalankan kembali: node extract-dynamic-blog-data.js
`);
}

// Main migration function
async function migrateDynamicBlogData() {
    let connection;
    
    try {
        // Extract data from localStorage
        const blogData = extractFromLocalStorageFile();
        
        if (!blogData) {
            createLocalStorageBackup();
            return;
        }
        
        // Connect to database
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL database successfully');

        // Clear existing data
        console.log('🗑️  Clearing existing blog articles...');
        await connection.execute('DELETE FROM blog_articles');
        console.log('✅ Existing blog articles cleared');

        // Insert dynamic data
        console.log(`📝 Inserting ${blogData.length} blog articles...`);
        
        let insertedCount = 0;
        let skippedCount = 0;
        
        for (const article of blogData) {
            const { id, cover, title, category, status, content } = article;
            
            // Skip if title is missing
            if (!title || title.trim() === '') {
                console.warn(`⚠️  Skipping article with missing title (ID: ${id})`);
                skippedCount++;
                continue;
            }
            
            try {
                const [result] = await connection.execute(
                    `INSERT INTO blog_articles (coverUrl, title, category, status, content) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        cover || '/placeholder-image.png',
                        title.trim(),
                        category || 'Uncategorized',
                        status || 'draft',
                        content || '<p>No content available</p>'
                    ]
                );
                
                console.log(`✅ Inserted: "${title}" (DB ID: ${result.insertId})`);
                insertedCount++;
                
            } catch (error) {
                console.error(`❌ Error inserting article "${title}":`, error.message);
                skippedCount++;
            }
        }

        // Verify insertion
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM blog_articles');
        const totalInDb = rows[0].count;
        
        console.log('\n📊 Migration Summary:');
        console.log(`========================`);
        console.log(`📝 Total articles found: ${blogData.length}`);
        console.log(`✅ Successfully inserted: ${insertedCount}`);
        console.log(`⚠️  Skipped/Failed: ${skippedCount}`);
        console.log(`🗄️  Total in database: ${totalInDb}`);
        
        if (insertedCount > 0) {
            console.log('\n🎉 Migration completed successfully!');
            console.log('📱 View data at: http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=travello_db&table=blog_articles');
            
            // Display inserted articles
            const [articles] = await connection.execute(
                'SELECT id, title, category, status, createdAt FROM blog_articles ORDER BY id DESC LIMIT 10'
            );
            
            console.log('\n📋 Latest Articles:');
            console.log('==================');
            articles.forEach(article => {
                console.log(`ID: ${article.id}`);
                console.log(`Title: ${article.title}`);
                console.log(`Category: ${article.category}`);
                console.log(`Status: ${article.status}`);
                console.log(`Created: ${article.createdAt}`);
                console.log('---');
            });
        }

    } catch (error) {
        console.error('❌ Migration error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

// Auto-extract from browser localStorage (if running in browser context)
function createBrowserScript() {
    const browserScript = `
// Paste this script in browser console at http://localhost:5173/admin/blog
(function() {
    const blogData = localStorage.getItem('admin_blog_articles');
    
    if (blogData) {
        const articles = JSON.parse(blogData);
        console.log('📝 Found', articles.length, 'articles in localStorage');
        console.log('📋 Articles:');
        articles.forEach((article, index) => {
            console.log(\`\${index + 1}. \${article.title} (\${article.status})\`);
        });
        
        // Create download link
        const dataStr = JSON.stringify(articles, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'blog-data.json');
        linkElement.click();
        
        console.log('✅ File blog-data.json downloaded!');
        console.log('🔄 Now run: node extract-dynamic-blog-data.js');
    } else {
        console.log('❌ No blog data found in localStorage');
        console.log('💡 Make sure you have added articles in the admin blog page');
    }
})();
`;
    
    fs.writeFileSync('browser-extract-script.js', browserScript);
    console.log('📜 Browser extraction script created: browser-extract-script.js');
}

// Check if this is being run with browser script flag
if (process.argv.includes('--browser-script')) {
    createBrowserScript();
} else {
    // Run main migration
    console.log('🚀 Dynamic Blog Data Migration');
    console.log('==================================');
    migrateDynamicBlogData();
}

module.exports = { migrateDynamicBlogData, extractFromLocalStorageFile };
