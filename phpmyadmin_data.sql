-- SQL Query untuk phpMyAdmin
-- Database: travello_db
-- Table: travel_journals
-- URL: http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=travello_db&table=travel_journals

-- 1. Hapus data yang ada (opsional)
-- DELETE FROM travel_journals;

-- 2. Insert data travel journals
INSERT INTO travel_journals (
    name, 
    coverUrl, 
    travelImageUrl, 
    description, 
    location, 
    date, 
    category, 
    tags, 
    isActive, 
    featured, 
    author, 
    views, 
    likes
) VALUES 
(
    'Banyuwangi Adventure',
    '/images/banyuwangi-cover.jpg',
    '/images/banyuwangi-travel.jpg',
    'Explore the beautiful beaches and traditional culture of Banyuwangi, East Java. Perfect destination for adventure seekers with stunning natural landscapes and rich cultural heritage.',
    'Banyuwangi, East Java, Indonesia',
    '2024-01-15',
    'adventure',
    '["beach", "culture", "adventure", "east-java", "traditional"]',
    TRUE,
    TRUE,
    'TRAVELLO Team',
    1250,
    89
),
(
    'Tokyo City Life',
    '/images/tokyo-cover.jpg',
    '/images/tokyo-travel.jpg',
    'Experience the perfect blend of modern city life and traditional culture in Tokyo, Japan. From neon-lit streets to ancient temples, Tokyo offers endless discoveries.',
    'Tokyo, Japan',
    '2024-02-20',
    'city',
    '["city", "modern", "culture", "japan", "urban"]',
    TRUE,
    FALSE,
    'TRAVELLO Team',
    980,
    67
),
(
    'Bali Paradise',
    '/images/bali-cover.jpg',
    '/images/bali-travel.jpg',
    'Discover the magical island of Bali with its stunning beaches, ancient temples, and vibrant culture. A true tropical paradise that captivates every visitor.',
    'Bali, Indonesia',
    '2024-03-10',
    'beach',
    '["beach", "temple", "culture", "paradise", "tropical"]',
    TRUE,
    TRUE,
    'TRAVELLO Team',
    2100,
    156
),
(
    'Swiss Alps Journey',
    '/images/alps-cover.jpg',
    '/images/alps-travel.jpg',
    'Breathtaking mountain scenery and alpine adventures in the Swiss Alps. Perfect for hiking, skiing, and nature lovers seeking majestic landscapes.',
    'Swiss Alps, Switzerland',
    '2024-01-25',
    'mountain',
    '["mountain", "hiking", "nature", "switzerland", "alpine"]',
    TRUE,
    FALSE,
    'TRAVELLO Team',
    750,
    45
),
(
    'Cultural Heritage Tour',
    '/images/heritage-cover.jpg',
    '/images/heritage-travel.jpg',
    'Explore rich cultural heritage sites and traditional experiences. Learn about local history and authentic cultural practices from around the world.',
    'Yogyakarta, Indonesia',
    '2024-04-05',
    'cultural',
    '["culture", "heritage", "history", "traditional", "ancient"]',
    TRUE,
    TRUE,
    'TRAVELLO Team',
    890,
    72
);

-- 3. Query untuk melihat semua data
SELECT * FROM travel_journals ORDER BY featured DESC, createdAt DESC;

-- 4. Query untuk melihat data yang aktif saja
SELECT * FROM travel_journals WHERE isActive = TRUE ORDER BY featured DESC, createdAt DESC;

-- 5. Query untuk melihat data yang featured
SELECT * FROM travel_journals WHERE featured = TRUE ORDER BY createdAt DESC;

-- 6. Query untuk update data (contoh)
-- UPDATE travel_journals 
-- SET name = 'Updated Name', description = 'Updated Description', updatedAt = NOW() 
-- WHERE id = 1;

-- 7. Query untuk delete data (contoh)
-- DELETE FROM travel_journals WHERE id = 1;

-- 8. Query untuk mencari data berdasarkan kategori
SELECT * FROM travel_journals WHERE category = 'adventure' ORDER BY createdAt DESC;

-- 9. Query untuk mencari data berdasarkan lokasi
SELECT * FROM travel_journals WHERE location LIKE '%Indonesia%' ORDER BY createdAt DESC;
