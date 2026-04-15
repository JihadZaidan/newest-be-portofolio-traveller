const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'travello_db',
    charset: 'utf8mb4'
};

async function verifyPhpMyAdminDisplay() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('🔍 Verifying Blog Articles Data in Database');
        console.log('==========================================');

        // 1. Check total count
        const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM blog_articles');
        console.log(`📊 Total articles in database: ${countResult[0].total}`);

        // 2. Check table structure
        const [structure] = await connection.execute('DESCRIBE blog_articles');
        console.log('\n📋 Table Structure:');
        structure.forEach(column => {
            console.log(`  - ${column.Field}: ${column.Type} (${column.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
        });

        // 3. Show all articles with details
        const [allArticles] = await connection.execute(`
            SELECT 
                id, 
                title, 
                category, 
                status, 
                CHAR_LENGTH(content) as content_length,
                createdAt,
                updatedAt
            FROM blog_articles 
            ORDER BY id ASC
        `);

        console.log('\n📝 All Articles in Database:');
        console.log('============================');
        allArticles.forEach((article, index) => {
            console.log(`${index + 1}. ID: ${article.id}`);
            console.log(`   Title: "${article.title}"`);
            console.log(`   Category: ${article.category}`);
            console.log(`   Status: ${article.status}`);
            console.log(`   Content Length: ${article.content_length} chars`);
            console.log(`   Created: ${article.createdAt}`);
            console.log(`   Updated: ${article.updatedAt}`);
            console.log('---');
        });

        // 4. Check for any potential issues
        console.log('\n🔍 Potential Issues Check:');
        
        // Check for duplicate titles
        const [duplicateCheck] = await connection.execute(`
            SELECT title, COUNT(*) as count 
            FROM blog_articles 
            GROUP BY title 
            HAVING COUNT(*) > 1
        `);
        
        if (duplicateCheck.length > 0) {
            console.log('⚠️  Found duplicate titles:');
            duplicateCheck.forEach(dup => {
                console.log(`   - "${dup.title}" (${dup.count} times)`);
            });
        } else {
            console.log('✅ No duplicate titles found');
        }

        // Check for empty content
        const [emptyContentCheck] = await connection.execute(`
            SELECT COUNT(*) as count 
            FROM blog_articles 
            WHERE content IS NULL OR content = '' OR CHAR_LENGTH(TRIM(content)) = 0
        `);
        
        if (emptyContentCheck[0].count > 0) {
            console.log(`⚠️  Found ${emptyContentCheck[0].count} articles with empty content`);
        } else {
            console.log('✅ All articles have content');
        }

        // 5. Generate SQL queries for manual verification
        console.log('\n📱 Manual Verification Queries:');
        console.log('===============================');
        console.log('-- Run these queries in phpMyAdmin to verify:');
        console.log('');
        console.log('1. Count all articles:');
        console.log(`SELECT COUNT(*) as total FROM blog_articles;`);
        console.log('');
        console.log('2. Show all articles:');
        console.log('SELECT * FROM blog_articles ORDER BY id ASC;');
        console.log('');
        console.log('3. Show article summary:');
        console.log('SELECT id, title, category, status FROM blog_articles ORDER BY id ASC;');
        console.log('');
        console.log('4. Check by status:');
        console.log('SELECT status, COUNT(*) as count FROM blog_articles GROUP BY status;');

        // 6. phpMyAdmin troubleshooting tips
        console.log('\n🛠️  phpMyAdmin Troubleshooting:');
        console.log('================================');
        console.log('If you still see only 3 articles in phpMyAdmin:');
        console.log('');
        console.log('1. **Check pagination settings**:');
        console.log('   - Look for "Show rows" dropdown (usually at bottom)');
        console.log('   - Change from "25" to "All" or higher number');
        console.log('');
        console.log('2. **Refresh the page**:');
        console.log('   - Press F5 or click refresh button');
        console.log('   - Or click "Browse" tab again');
        console.log('');
        console.log('3. **Check SQL query**:');
        console.log('   - Click "SQL" tab');
        console.log('   - Run: SELECT * FROM blog_articles ORDER BY id ASC;');
        console.log('');
        console.log('4. **Check table selection**:');
        console.log('   - Make sure you\'re looking at "blog_articles" table');
        console.log('   - Verify database is "travello_db"');
        console.log('');
        console.log('5. **Clear browser cache**:');
        console.log('   - Clear phpMyAdmin cache');
        console.log('   - Try opening in incognito mode');

        console.log('\n📊 Final Summary:');
        console.log('=================');
        console.log(`✅ Database contains: ${countResult[0].total} articles`);
        console.log(`📱 phpMyAdmin URL: http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=travello_db&table=blog_articles`);
        
        if (countResult[0].total >= 10) {
            console.log('🎉 All data is correctly stored in database!');
            console.log('💡 The issue is likely with phpMyAdmin display settings, not the data.');
        } else {
            console.log('⚠️  Data count is lower than expected. Check migration logs.');
        }

    } catch (error) {
        console.error('❌ Verification error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run verification
verifyPhpMyAdminDisplay();
