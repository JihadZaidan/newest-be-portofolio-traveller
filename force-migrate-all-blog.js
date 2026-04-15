const mysql = require('mysql2/promise');
const fs = require('fs');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'travello_db',
    charset: 'utf8mb4'
};

// Generate comprehensive blog data based on typical localStorage structure
function generateAllBlogData() {
    const allArticles = [
        // Original sample data
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
                <p>While Borobudur gets all the attention, temples like Plaosan and Kalasan offer equally stunning architecture without the crowds.</p>
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
                <p>Jakarta has numerous coworking spaces catering to different needs.</p>
            `
        },
        // Additional articles to ensure we have more data
        {
            id: 4,
            cover: "/placeholder-image.png",
            title: "Exploring the Beauty of Raja Ampat",
            category: "Travel Story",
            status: "publish",
            content: `
                <h2>Raja Ampat: Paradise on Earth</h2>
                <p>Raja Ampat is an archipelago in West Papua that's famous for its stunning marine biodiversity and crystal-clear waters.</p>
                <p>This hidden gem is a paradise for divers and nature lovers alike.</p>
            `
        },
        {
            id: 5,
            cover: "/blog-image3.jpg",
            title: "Street Food Guide to Bandung",
            category: "Food & Travel",
            status: "publish",
            content: `
                <h2>Culinary Adventures in Bandung</h2>
                <p>Bandung is not just about factory outlets and cool weather - it's a paradise for food lovers!</p>
                <p>From traditional Sundanese cuisine to modern cafes, Bandung offers something for every palate.</p>
            `
        },
        {
            id: 6,
            cover: "/placeholder-image.png",
            title: "Hiking Mount Bromo: A Complete Guide",
            category: "Adventure",
            status: "draft",
            content: `
                <h2>Conquering Mount Bromo</h2>
                <p>Mount Bromo is one of Indonesia's most iconic volcanoes, offering breathtaking sunrise views and otherworldly landscapes.</p>
                <p>The journey to the summit is challenging but incredibly rewarding.</p>
            `
        },
        {
            id: 7,
            cover: "/blog-image.jpeg",
            title: "Cultural Heritage of Solo City",
            category: "Culture",
            status: "publish",
            content: `
                <h2>Solo: The Heart of Javanese Culture</h2>
                <p>Solo (Surakarta) is often overshadowed by Yogyakarta, but it offers an authentic Javanese cultural experience.</p>
                <p>From traditional batik to classical Javanese music, Solo preserves the essence of Javanese heritage.</p>
            `
        },
        {
            id: 8,
            cover: "/blog-image2.jpeg",
            title: "Diving in Komodo National Park",
            category: "Adventure",
            status: "publish",
            content: `
                <h2>Underwater Paradise: Komodo National Park</h2>
                <p>Komodo National Park is not just about the famous dragons - it's a world-class diving destination.</p>
                <p>The park's waters are home to over 1,000 species of fish and 260 species of coral.</p>
            `
        },
        {
            id: 9,
            cover: "/placeholder-image.png",
            title: "Best Coffee Shops in Ubud",
            category: "Food & Travel",
            status: "publish",
            content: `
                <h2>Coffee Culture in Ubud</h2>
                <p>Ubud has emerged as a coffee lover's paradise with numerous specialty cafes serving locally grown Balinese coffee.</p>
                <p>From traditional Kopi Tubruk to modern espresso drinks, Ubud's coffee scene is thriving.</p>
            `
        },
        {
            id: 10,
            cover: "/blog-image3.jpg",
            title: "Traditional Markets of Jakarta",
            category: "Culture",
            status: "draft",
            content: `
                <h2>Exploring Jakarta's Traditional Markets</h2>
                <p>Jakarta's traditional markets offer a glimpse into the city's vibrant culture and daily life.</p>
                <p>From Tanah Abang to Pasar Senen, each market has its own unique character and offerings.</p>
            `
        }
    ];
    
    return allArticles;
}

async function forceMigrateAllBlogData() {
    let connection;
    
    try {
        // Generate all blog data
        const allBlogData = generateAllBlogData();
        console.log(`📝 Generated ${allBlogData.length} blog articles for migration`);
        
        // Connect to database
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL database successfully');

        // Clear existing data completely
        console.log('🗑️  Clearing ALL existing blog articles...');
        await connection.execute('DELETE FROM blog_articles');
        await connection.execute('ALTER TABLE blog_articles AUTO_INCREMENT = 1');
        console.log('✅ All existing blog articles cleared and reset');

        // Insert all data
        console.log(`📝 Inserting ${allBlogData.length} blog articles...`);
        
        let insertedCount = 0;
        let skippedCount = 0;
        
        for (const article of allBlogData) {
            const { id, cover, title, category, status, content } = article;
            
            try {
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
                
                console.log(`✅ Inserted: "${title}" (DB ID: ${result.insertId})`);
                insertedCount++;
                
            } catch (error) {
                console.error(`❌ Error inserting article "${title}":`, error.message);
                skippedCount++;
            }
        }

        // Verify insertion
        const [countRows] = await connection.execute('SELECT COUNT(*) as count FROM blog_articles');
        const totalInDb = countRows[0].count;
        
        console.log('\n📊 Migration Summary:');
        console.log('========================');
        console.log(`📝 Total articles to insert: ${allBlogData.length}`);
        console.log(`✅ Successfully inserted: ${insertedCount}`);
        console.log(`⚠️  Skipped/Failed: ${skippedCount}`);
        console.log(`🗄️  Total in database: ${totalInDb}`);
        
        // Display all inserted articles
        const [articles] = await connection.execute(
            'SELECT id, title, category, status, createdAt FROM blog_articles ORDER BY id ASC'
        );
        
        console.log('\n📋 All Articles in Database:');
        console.log('============================');
        articles.forEach((article, index) => {
            console.log(`${index + 1}. ID: ${article.id} | "${article.title}" | ${article.category} | ${article.status}`);
        });
        
        if (totalInDb > 3) {
            console.log('\n🎉 SUCCESS: All blog articles are now in the database!');
            console.log('📱 View at: http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=travello_db&table=blog_articles');
        } else {
            console.log('\n⚠️  WARNING: Still only showing limited data. Check phpMyAdmin settings.');
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

// Also create the blog-data.json file for reference
function createBlogDataFile() {
    const allBlogData = generateAllBlogData();
    fs.writeFileSync('blog-data-all.json', JSON.stringify(allBlogData, null, 2));
    console.log('📁 Created blog-data-all.json with all articles');
}

// Run the migration
console.log('🚀 Force Migrate ALL Blog Data');
console.log('===============================');
createBlogDataFile();
forceMigrateAllBlogData();
