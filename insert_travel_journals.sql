-- SQL Query untuk memasukkan data ke tabel travel_journals
-- Database: travello_db
-- Table: travel_journals

-- Insert sample travel journal data
INSERT INTO travel_journals (
    id, 
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
    likes,
    createdAt, 
    updatedAt
) VALUES 
(
    1,
    'Banyuwangi Adventure',
    '/images/banyuwangi-cover.jpg',
    '/images/banyuwangi-travel.jpg',
    'Explore the beautiful beaches and traditional culture of Banyuwangi, East Java. Perfect destination for adventure seekers.',
    'Banyuwangi, East Java, Indonesia',
    '2024-01-15',
    'adventure',
    '["beach", "culture", "adventure", "east-java"]',
    TRUE,
    TRUE,
    'TRAVELLO Team',
    1250,
    89,
    NOW(),
    NOW()
),
(
    2,
    'Tokyo City Life',
    '/images/tokyo-cover.jpg',
    '/images/tokyo-travel.jpg',
    'Experience the perfect blend of modern city life and traditional culture in Tokyo, Japan. From neon lights to ancient temples.',
    'Tokyo, Japan',
    '2024-02-20',
    'city',
    '["city", "modern", "culture", "japan"]',
    TRUE,
    FALSE,
    'TRAVELLO Team',
    980,
    67,
    NOW(),
    NOW()
),
(
    3,
    'Bali Paradise',
    '/images/bali-cover.jpg',
    '/images/bali-travel.jpg',
    'Discover the magical island of Bali with its stunning beaches, ancient temples, and vibrant culture. A true tropical paradise.',
    'Bali, Indonesia',
    '2024-03-10',
    'beach',
    '["beach", "temple", "culture", "paradise"]',
    TRUE,
    TRUE,
    'TRAVELLO Team',
    2100,
    156,
    NOW(),
    NOW()
),
(
    4,
    'Swiss Alps Journey',
    '/images/alps-cover.jpg',
    '/images/alps-travel.jpg',
    'Breathtaking mountain scenery and alpine adventures in the Swiss Alps. Perfect for hiking, skiing, and nature lovers.',
    'Swiss Alps, Switzerland',
    '2024-01-25',
    'mountain',
    '["mountain", "hiking", "nature", "switzerland"]',
    TRUE,
    FALSE,
    'TRAVELLO Team',
    750,
    45,
    NOW(),
    NOW()
),
(
    5,
    'Cultural Heritage Tour',
    '/images/heritage-cover.jpg',
    '/images/heritage-travel.jpg',
    'Explore rich cultural heritage sites and traditional experiences. Learn about local history and authentic cultural practices.',
    'Yogyakarta, Indonesia',
    '2024-04-05',
    'cultural',
    '["culture", "heritage", "history", "traditional"]',
    TRUE,
    TRUE,
    'TRAVELLO Team',
    890,
    72,
    NOW(),
    NOW()
);

-- Query untuk melihat data yang sudah dimasukkan
SELECT * FROM travel_journals ORDER BY createdAt DESC;

-- Query untuk update data jika diperlukan
-- UPDATE travel_journals 
-- SET name = 'New Name', description = 'New Description', updatedAt = NOW() 
-- WHERE id = 1;

-- Query untuk delete data jika diperlukan
-- DELETE FROM travel_journals WHERE id = 1;
