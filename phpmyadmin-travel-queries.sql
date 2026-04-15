-- SQL Queries for Travel Journal Management
-- Database: travello_db
-- Table: travel_journals
-- URL: http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=travello_db&table=travel_journals

-- 1. View all travel journals (ordered by featured first, then by creation date)
SELECT 
    id, 
    name, 
    location, 
    category, 
    isActive, 
    featured, 
    author, 
    views, 
    likes,
    DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i') as formatted_date
FROM travel_journals 
ORDER BY featured DESC, createdAt DESC;

-- 2. View only active travel journals
SELECT 
    id, 
    name, 
    location, 
    category, 
    views, 
    likes,
    CASE WHEN featured = 1 THEN 'Featured' ELSE 'Regular' END as status
FROM travel_journals 
WHERE isActive = 1 
ORDER BY featured DESC, views DESC, createdAt DESC;

-- 3. View only featured travel journals
SELECT 
    id, 
    name, 
    location, 
    category, 
    views, 
    likes,
    description
FROM travel_journals 
WHERE isActive = 1 AND featured = 1 
ORDER BY createdAt DESC;

-- 4. Category statistics
SELECT 
    category, 
    COUNT(*) as count,
    SUM(views) as total_views,
    SUM(likes) as total_likes
FROM travel_journals 
WHERE isActive = 1 
GROUP BY category 
ORDER BY count DESC;

-- 5. Search travel journals by location
SELECT 
    id, 
    name, 
    location, 
    category, 
    views, 
    likes
FROM travel_journals 
WHERE location LIKE '%Indonesia%' 
ORDER BY featured DESC, createdAt DESC;

-- 6. View detailed data for a specific journal (change ID as needed)
SELECT 
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
FROM travel_journals 
WHERE id = 3; -- Change this ID to view different journal

-- 7. Add a new travel journal (example)
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
    author
) VALUES (
    'new_journal_id_123', 
    'New Adventure', 
    '/images/new-cover.jpg', 
    '/images/new-travel.jpg', 
    'An amazing new adventure destination', 
    'New Location', 
    '2024-04-14', 
    'adventure', 
    '["adventure", "new", "exciting"]', 
    1, 
    0, 
    'TRAVELLO Team'
);

-- 8. Update an existing travel journal
UPDATE travel_journals 
SET 
    name = 'Updated Name',
    description = 'Updated description',
    views = views + 1,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = 1;

-- 9. Toggle featured status
UPDATE travel_journals 
SET featured = CASE WHEN featured = 1 THEN 0 ELSE 1 END,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = 1;

-- 10. Toggle active status
UPDATE travel_journals 
SET isActive = CASE WHEN isActive = 1 THEN 0 ELSE 1 END,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = 1;

-- 11. Delete a travel journal
DELETE FROM travel_journals WHERE id = 1;

-- 12. Get journals with most views
SELECT 
    id, 
    name, 
    location, 
    views, 
    likes,
    category
FROM travel_journals 
WHERE isActive = 1 
ORDER BY views DESC 
LIMIT 5;

-- 13. Get recent journals (last 30 days)
SELECT 
    id, 
    name, 
    location, 
    category,
    DATEDIFF(CURRENT_DATE, createdAt) as days_ago
FROM travel_journals 
WHERE isActive = 1 
    AND createdAt >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
ORDER BY createdAt DESC;

-- 14. Check data integrity
SELECT 
    COUNT(*) as total_journals,
    COUNT(CASE WHEN isActive = 1 THEN 1 END) as active_journals,
    COUNT(CASE WHEN featured = 1 THEN 1 END) as featured_journals,
    SUM(views) as total_views,
    SUM(likes) as total_likes,
    COUNT(CASE WHEN coverUrl IS NOT NULL AND coverUrl != '' THEN 1 END) as journals_with_cover,
    COUNT(CASE WHEN travelImageUrl IS NOT NULL AND travelImageUrl != '' THEN 1 END) as journals_with_travel_image
FROM travel_journals;

-- 15. Export data for backup
SELECT 
    id,
    name,
    description,
    location,
    category,
    tags,
    author,
    views,
    likes,
    isActive,
    featured,
    DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as created_at,
    DATE_FORMAT(updatedAt, '%Y-%m-%d %H:%i:%s') as updated_at
FROM travel_journals 
ORDER BY createdAt DESC;
