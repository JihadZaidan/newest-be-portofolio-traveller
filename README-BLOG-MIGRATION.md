# Blog Data Migration Guide

This guide will help you migrate blog articles from the frontend localStorage to the MySQL database.

## Prerequisites

1. Make sure your MySQL server is running
2. The `travello_db` database should exist
3. The `blog_articles` table should be created (included in database-setup.sql)

## Quick Start

### Option 1: Use Sample Data

The migration script includes sample blog data that you can use immediately:

```bash
npm run migrate:blog
```

This will:
- Connect to your MySQL database
- Clear existing blog articles
- Insert 3 sample blog articles
- Show you the results

### Option 2: Use Your Actual Data from Frontend

If you have blog articles in your frontend localStorage:

1. **Open your browser** and go to `http://localhost:5173/admin/blog`
2. **Open Developer Console** (F12)
3. **Run this command** in the console:
   ```javascript
   localStorage.getItem('admin_blog_articles')
   ```
4. **Copy the output** and save it to a file named `blog-data.json` in this directory
5. **Run the migration**:
   ```bash
   npm run migrate:blog -- --from-file
   ```

## Database Configuration

The script uses these default MySQL settings:
- Host: localhost
- User: root
- Password: (empty)
- Database: travello_db

If your MySQL configuration is different, edit the `dbConfig` object in `migrate-blog-data.js`:

```javascript
const dbConfig = {
    host: 'your_host',
    user: 'your_username',
    password: 'your_password',
    database: 'travello_db',
    charset: 'utf8mb4'
};
```

## Available Commands

```bash
# Run migration with sample data
npm run migrate:blog

# Run migration with data from blog-data.json file
npm run migrate:blog -- --from-file

# Clear only existing blog articles
npm run migrate:blog:clear

# Show help
npm run migrate:blog:help
```

## What Gets Migrated

The script migrates these fields from frontend to database:

| Frontend Field | Database Field | Description |
|---------------|----------------|-------------|
| `cover` | `coverUrl` | Article cover image URL |
| `title` | `title` | Article title |
| `category` | `category` | Article category |
| `status` | `status` | 'publish' or 'draft' |
| `content` | `content` | HTML content of the article |

## Sample Data Included

The migration includes 3 sample articles:

1. **"Tips for Preparing a Trip to Bali"** (Travel Tips, Published)
2. **"Hidden Gems of Yogyakarta"** (Travel Story, Published)  
3. **"Digital Nomad Guide to Jakarta"** (Travel Tips, Draft)

## Verification

After migration, you can verify the data in several ways:

### 1. Check the Script Output
The script will show you what was inserted:

```
Inserted Articles:
==================
ID: 1
Title: Tips for Preparing a Trip to Bali
Category: Travel Tips
Status: publish
Created: 2024-01-15 10:30:00
---
```

### 2. Check in phpMyAdmin
Go to: http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=travello_db&table=blog_articles

### 3. Check via MySQL CLI
```sql
USE travello_db;
SELECT id, title, category, status FROM blog_articles;
```

## Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Make sure MySQL server is running
- Check your MySQL credentials in the script

### Database Not Found
```
Error: Unknown database 'travello_db'
```
- Create the database first using the database-setup.sql script
- Check if the database name is correct

### Permission Error
```
Error: Access denied for user 'root'@'localhost'
```
- Check your MySQL password
- Make sure the user has the necessary privileges

## Next Steps

After migration:

1. **Update your frontend** to fetch data from the database instead of localStorage
2. **Create API endpoints** for CRUD operations on blog articles
3. **Update the admin interface** to use the new API
4. **Test the integration** between frontend and backend

## API Integration Example

You can create these API endpoints in your backend:

```javascript
// GET all blog articles
app.get('/api/blog/articles', async (req, res) => {
    const [articles] = await connection.execute(
        'SELECT * FROM blog_articles ORDER BY createdAt DESC'
    );
    res.json(articles);
});

// POST new blog article
app.post('/api/blog/articles', async (req, res) => {
    const { coverUrl, title, category, status, content } = req.body;
    const [result] = await connection.execute(
        'INSERT INTO blog_articles (coverUrl, title, category, status, content) VALUES (?, ?, ?, ?, ?)',
        [coverUrl, title, category, status, content]
    );
    res.json({ id: result.insertId });
});
```

## Support

If you encounter any issues:
1. Check the MySQL server status
2. Verify database credentials
3. Ensure the blog_articles table exists
4. Review the error messages carefully
