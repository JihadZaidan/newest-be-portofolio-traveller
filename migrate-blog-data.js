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

// Sample blog data from frontend localStorage structure
const sampleBlogData = [
    {
        id: 1,
        cover: "/placeholder-image.png",
        title: "Tips for Preparing a Trip to Bali",
        category: "Travel Tips",
        status: "publish",
        content: `
            <h2>Planning Your Bali Adventure</h2>
            <p>Bali is one of the most popular destinations in Indonesia, offering a perfect blend of beautiful beaches, rich culture, and amazing food. Here are some essential tips to make your trip unforgettable.</p>
            
            <h3>Best Time to Visit</h3>
            <p>The dry season from April to October is ideal for beach activities and outdoor exploration. However, the wet season has its own charm with lush green landscapes.</p>
            
            <h3>Must-Visit Places</h3>
            <ul>
                <li><strong>Ubud:</strong> Cultural heart of Bali with rice terraces and temples</li>
                <li><strong>Seminyak:</strong> Perfect for luxury resorts and fine dining</li>
                <li><strong>Canggu:</strong> Great for surfers and digital nomads</li>
                <li><strong>Uluwatu:</strong> Stunning cliffs and beautiful temples</li>
            </ul>
            
            <h3>Packing Essentials</h3>
            <p>Don't forget to pack lightweight clothing, sunscreen, insect repellent, and a universal adapter. A good camera is a must to capture Bali's stunning landscapes!</p>
            
            <h3>Local Tips</h3>
            <p>Respect local customs, especially when visiting temples. Always carry cash as many small businesses don't accept cards. Learn a few basic Indonesian phrases - locals appreciate the effort!</p>
        `
    },
    {
        id: 2,
        cover: "/blog-image.jpeg",
        title: "Hidden Gems of Yogyakarta",
        category: "Travel Story",
        status: "publish",
        content: `
            <h2>Discovering Yogyakarta's Treasures</h2>
            <p>Yogyakarta, often called Jogja, is a cultural hub that offers more than just the famous Borobudur and Prambanan temples. Let me share some hidden gems that will make your visit truly special.</p>
            
            <h3>Off-the-Beaten-Path Temples</h3>
            <p>While Borobudur gets all the attention, temples like Plaosan and Kalasan offer equally stunning architecture without the crowds. These temples showcase beautiful Buddhist and Hindu influences.</p>
            
            <h3>Culinary Adventures</h3>
            <p>Jogja's street food scene is incredible. Try Gudeg, the city's signature dish, or explore the vibrant Malioboro street for local snacks and delicacies. Don't miss the night food markets!</p>
            
            <h3>Art and Culture</h3>
            <p>Visit the local art communities in Kasihan and Bantul. You can watch traditional batik making, pottery, and even try your hand at these crafts. The local artists are always happy to share their knowledge.</p>
            
            <h3>Nature Escapes</h3>
            <p>Just outside the city, you'll find beautiful beaches like Parangtritis and stunning caves like Jomblang. These natural wonders offer a perfect escape from the city bustle.</p>
        `
    },
    {
        id: 3,
        cover: "/blog-image2.jpeg",
        title: "Digital Nomad Guide to Jakarta",
        category: "Travel Tips",
        status: "draft",
        content: `
            <h2>Working Remotely in Indonesia's Capital</h2>
            <p>Jakarta might not be the first city that comes to mind for digital nomads, but this bustling metropolis has a lot to offer for remote workers.</p>
            
            <h3>Coworking Spaces</h3>
            <p>Jakarta has numerous coworking spaces catering to different needs. From luxury spaces in SCBD to more affordable options in South Jakarta, there's something for every budget.</p>
            
            <h3>Connectivity</h3>
            <p>Internet infrastructure in Jakarta has improved significantly. Most cafes and coworking spaces offer reliable high-speed internet. Getting a local SIM card is easy and affordable.</p>
            
            <h3>Cost of Living</h3>
            <p>Compared to other Southeast Asian capitals, Jakarta offers reasonable living costs. From street food to fine dining, the city caters to all budgets.</p>
            
            <h3>Work-Life Balance</h3>
            <p>Jakarta offers great weekend getaway options. From nearby islands like Thousand Islands to cool mountain retreats in Puncak, you're never far from an escape.</p>
        `
    }
];

async function migrateBlogData() {
    let connection;
    
    try {
        // Connect to database
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database successfully');

        // Handle existing data based on merge option
        if (!shouldMerge) {
            console.log('Clearing existing blog articles...');
            await connection.execute('DELETE FROM blog_articles');
            console.log('Existing blog articles cleared');
        } else {
            console.log('Merging with existing blog articles...');
        }

        // Insert blog data
        console.log(`Inserting ${blogDataToMigrate.length} blog articles...`);
        
        for (const article of blogDataToMigrate) {
            const { id, cover, title, category, status, content } = article;
            
            // Skip if title is missing
            if (!title) {
                console.warn(`Skipping article with missing title (ID: ${id})`);
                continue;
            }
            
            const [result] = await connection.execute(
                `INSERT INTO blog_articles (coverUrl, title, category, status, content) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    cover || '/placeholder-image.png',
                    title,
                    category || 'Uncategorized',
                    status || 'draft',
                    content || '<p>No content available</p>'
                ]
            );
            
            console.log(`Inserted article: "${title}" (ID: ${result.insertId})`);
        }

        // Verify insertion
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM blog_articles');
        console.log(`Total articles in database: ${rows[0].count}`);

        // Display inserted articles
        const [articles] = await connection.execute(
            'SELECT id, title, category, status, createdAt FROM blog_articles ORDER BY id'
        );
        
        console.log('\nInserted Articles:');
        console.log('==================');
        articles.forEach(article => {
            console.log(`ID: ${article.id}`);
            console.log(`Title: ${article.title}`);
            console.log(`Category: ${article.category}`);
            console.log(`Status: ${article.status}`);
            console.log(`Created: ${article.createdAt}`);
            console.log('---');
        });

        console.log('\nMigration completed successfully!');

    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

// Additional function to extract data from browser localStorage (if needed)
function extractFromLocalStorage() {
    console.log(`
To extract data from your browser's localStorage:
1. Open your browser's developer console (F12)
2. Navigate to the admin blog page: http://localhost:5173/admin/blog
3. Run this command in the console:
   localStorage.getItem('admin_blog_articles')
4. Copy the output and save it to a file named 'blog-data.json'
5. Run: node migrate-blog-data.js --from-file

This will extract the actual data from your frontend localStorage.
`);
}

// Handle command line arguments
if (process.argv.includes('--help')) {
    console.log(`
Usage: node migrate-blog-data.js [options]

Options:
  --help          Show this help message
  --from-file     Read data from blog-data.json file instead of sample data
  --clear-only    Only clear existing data, don't insert new data
  --merge         Merge with existing data instead of replacing
`);
    process.exit(0);
}

let blogDataToMigrate = sampleBlogData;
let shouldMerge = process.argv.includes('--merge');

if (process.argv.includes('--from-file')) {
    // Try to read from file
    try {
        const jsonData = fs.readFileSync(path.join(__dirname, 'blog-data.json'), 'utf8');
        blogDataToMigrate = JSON.parse(jsonData);
        console.log(`Loaded ${blogDataToMigrate.length} articles from blog-data.json`);
        
        // Validate data structure
        if (!Array.isArray(blogDataToMigrate)) {
            throw new Error('Data must be an array');
        }
        
        // Validate each article
        blogDataToMigrate.forEach((article, index) => {
            if (!article.title) {
                console.warn(`Warning: Article at index ${index} is missing title`);
            }
            if (!article.content) {
                console.warn(`Warning: Article "${article.title || 'Unknown'}" is missing content`);
            }
        });
        
    } catch (error) {
        console.error('Error reading blog-data.json:', error);
        console.log('Make sure to extract data from localStorage first (see extract-blog-data.js)');
        process.exit(1);
    }
}

if (process.argv.includes('--clear-only')) {
    (async () => {
        let connection;
        try {
            connection = await mysql.createConnection(dbConfig);
            await connection.execute('DELETE FROM blog_articles');
            console.log('Blog articles table cleared successfully');
        } catch (error) {
            console.error('Error clearing table:', error);
        } finally {
            if (connection) await connection.end();
        }
    })();
} else {
    // Run main migration
    migrateBlogData();
    extractFromLocalStorage();
}

module.exports = { migrateBlogData, sampleBlogData };
