const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'travello_db'
};

async function verifyTravelJournalData() {
    let connection;
    
    try {
        // Connect to database
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database\n');

        // Query 1: Get all travel journals
        console.log('=== ALL TRAVEL JOURNALS ===');
        const [allJournals] = await connection.execute(`
            SELECT id, name, location, category, isActive, featured, author, createdAt, updatedAt
            FROM travel_journals 
            ORDER BY featured DESC, createdAt DESC
        `);
        
        console.log(`Total journals: ${allJournals.length}\n`);
        allJournals.forEach((journal, index) => {
            console.log(`${index + 1}. ${journal.name}`);
            console.log(`   ID: ${journal.id}`);
            console.log(`   Location: ${journal.location}`);
            console.log(`   Category: ${journal.category}`);
            console.log(`   Active: ${journal.isActive ? 'Yes' : 'No'}`);
            console.log(`   Featured: ${journal.featured ? 'Yes' : 'No'}`);
            console.log(`   Author: ${journal.author}`);
            console.log(`   Created: ${journal.createdAt}`);
            console.log('');
        });

        // Query 2: Get active journals only
        console.log('=== ACTIVE TRAVEL JOURNALS ===');
        const [activeJournals] = await connection.execute(`
            SELECT id, name, location, category, featured, views, likes
            FROM travel_journals 
            WHERE isActive = 1 
            ORDER BY featured DESC, createdAt DESC
        `);
        
        console.log(`Active journals: ${activeJournals.length}\n`);
        activeJournals.forEach((journal, index) => {
            console.log(`${index + 1}. ${journal.name} (${journal.location})`);
            console.log(`   Views: ${journal.views}, Likes: ${journal.likes}`);
            console.log(`   Featured: ${journal.featured ? 'Yes' : 'No'}`);
            console.log('');
        });

        // Query 3: Get featured journals only
        console.log('=== FEATURED TRAVEL JOURNALS ===');
        const [featuredJournals] = await connection.execute(`
            SELECT id, name, location, category, views, likes
            FROM travel_journals 
            WHERE isActive = 1 AND featured = 1 
            ORDER BY createdAt DESC
        `);
        
        console.log(`Featured journals: ${featuredJournals.length}\n`);
        featuredJournals.forEach((journal, index) => {
            console.log(`${index + 1}. ${journal.name} (${journal.location})`);
            console.log(`   Views: ${journal.views}, Likes: ${journal.likes}`);
            console.log('');
        });

        // Query 4: Category statistics
        console.log('=== CATEGORY STATISTICS ===');
        const [categoryStats] = await connection.execute(`
            SELECT category, COUNT(*) as count
            FROM travel_journals 
            WHERE isActive = 1 
            GROUP BY category 
            ORDER BY count DESC
        `);
        
        console.log('Categories:');
        categoryStats.forEach((stat) => {
            console.log(`   ${stat.category}: ${stat.count} journals`);
        });
        console.log('');

        // Query 5: Sample data with images and tags
        console.log('=== SAMPLE DETAILED DATA ===');
        const [sampleData] = await connection.execute(`
            SELECT id, name, coverUrl, travelImageUrl, description, tags
            FROM travel_journals 
            WHERE isActive = 1 
            LIMIT 3
        `);
        
        sampleData.forEach((journal) => {
            console.log(`\n--- ${journal.name} ---`);
            console.log(`Cover URL: ${journal.coverUrl}`);
            console.log(`Travel Image URL: ${journal.travelImageUrl}`);
            console.log(`Description: ${journal.description.substring(0, 100)}...`);
            console.log(`Tags: ${journal.tags}`);
        });

        console.log('\n=== VERIFICATION COMPLETE ===');
        console.log('Database connection successful');
        console.log('Travel journals data is accessible');

    } catch (error) {
        console.error('Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('\nTroubleshooting:');
            console.log('1. Make sure MySQL/XAMPP is running');
            console.log('2. Check database credentials in the script');
            console.log('3. Verify database name "travello_db" exists');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('\nDatabase connection closed');
        }
    }
}

// Run the verification
verifyTravelJournalData();
