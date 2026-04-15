const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 55435;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection for XAMPP
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travello_db',
  port: 3306 // XAMPP default MySQL port
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    console.log('Make sure XAMPP MySQL is running and travello_db exists');
    return;
  }
  console.log('Connected to travello_db database via XAMPP');
  
  // Create table if not exists
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS portfolios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100) DEFAULT 'product-description',
      imageUrl VARCHAR(500),
      projectUrl VARCHAR(500),
      tags JSON,
      technologies JSON,
      featured BOOLEAN DEFAULT TRUE,
      published BOOLEAN DEFAULT TRUE,
      orderIndex INT DEFAULT 0,
      clientName VARCHAR(255),
      completionDate DATE,
      createdBy VARCHAR(255) DEFAULT 'admin',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Portfolios table ready');
    }
  });
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// API Routes

// GET all portfolios
app.get('/api/portfolios', (req, res) => {
  const sql = 'SELECT * FROM portfolios ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching portfolios:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    // Parse JSON fields and map to expected format
    const portfolios = results.map(portfolio => ({
      ...portfolio,
      images: portfolio.imageUrl ? [portfolio.imageUrl] : [], // Convert single imageUrl to array
      tags: portfolio.tags ? JSON.parse(portfolio.tags) : [],
      technologies: portfolio.technologies ? JSON.parse(portfolio.technologies) : []
    }));
    
    res.json({ success: true, data: { portfolios } });
  });
});

// POST new portfolio
app.post('/api/portfolios', upload.array('images', 2), (req, res) => {
  const { title, description, category, tags, technologies, featured, isActive, client, projectDate } = req.body;
  
  // Handle uploaded images - use first image as imageUrl
  const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
  const imageUrl = images.length > 0 ? images[0] : '';
  
  const sql = `
    INSERT INTO portfolios 
    (title, description, category, imageUrl, projectUrl, technologies, tags, featured, isActive, client, projectDate, author, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  
  const values = [
    title || 'Untitled Portfolio',
    description || '',
    category || 'product-description',
    imageUrl,
    '', // projectUrl
    technologies || '[]',
    tags ? JSON.stringify(Array.isArray(tags) ? tags : (tags ? [tags] : [])) : JSON.stringify([]),
    featured === 'true' || featured === true ? 1 : 0,
    isActive === 'true' || isActive === true ? 1 : 0,
    client || 'admin',
    projectDate || null,
    'admin'
  ];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting portfolio:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    res.json({ 
      success: true, 
      message: 'Portfolio created successfully',
      data: { id: result.insertId }
    });
  });
});

// DELETE portfolio
app.delete('/api/portfolios/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM portfolios WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting portfolio:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    
    res.json({ success: true, message: 'Portfolio deleted successfully' });
  });
});

// Travel Journals API Routes

// GET all travel journals with pagination and search
app.get('/api/travel-journals', (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  let sql = 'SELECT * FROM travel_journals';
  let countSql = 'SELECT COUNT(*) as total FROM travel_journals';
  const params = [];
  
  // Add search condition if provided
  if (search) {
    sql += ' WHERE name LIKE ? OR location LIKE ? OR category LIKE ? OR description LIKE ?';
    countSql += ' WHERE name LIKE ? OR location LIKE ? OR category LIKE ? OR description LIKE ?';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }
  
  // Add ordering and pagination
  sql += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);
  
  // Execute main query
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error fetching travel journals:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    // Execute count query
    const countParams = search ? params.slice(0, 4) : [];
    db.query(countSql, countParams, (countErr, countResults) => {
      if (countErr) {
        console.error('Error counting travel journals:', countErr);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      const total = countResults[0].total;
      
      // Parse JSON fields and fix image paths
      const journals = results.map(journal => ({
        ...journal,
        tags: journal.tags ? JSON.parse(journal.tags) : [],
        // Fix image paths - convert /api/media/ to /uploads/ for uploaded files
        coverUrl: journal.coverUrl ? 
          (journal.coverUrl.startsWith('/api/media/') ? 
            journal.coverUrl.replace('/api/media/', '/uploads/') : 
            journal.coverUrl) : null,
        travelImageUrl: journal.travelImageUrl ? 
          (journal.travelImageUrl.startsWith('/api/media/') ? 
            journal.travelImageUrl.replace('/api/media/', '/uploads/') : 
            journal.travelImageUrl) : null
      }));
      
      res.json({ 
        success: true, 
        data: journals,
        pagination: {
          currentPage: parseInt(page),
          itemsPerPage: parseInt(limit),
          totalItems: total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    });
  });
});

// GET travel journal by ID
app.get('/api/travel-journals/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM travel_journals WHERE id = ?';
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching travel journal:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Travel journal not found' });
    }
    
    const journal = {
      ...results[0],
      tags: results[0].tags ? JSON.parse(results[0].tags) : []
    };
    
    res.json({ success: true, data: journal });
  });
});

// POST new travel journal
app.post('/api/travel-journals', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'travelImage', maxCount: 1 }
]), (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const { 
      name, 
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
    } = req.body;
    
    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Name is required' 
      });
    }
    
    // Handle uploaded images
    const coverImage = req.files?.coverImage ? `/uploads/${req.files.coverImage[0].filename}` : '';
    const travelImage = req.files?.travelImage ? `/uploads/${req.files.travelImage[0].filename}` : '';
    
    // Validate image uploads
    if (!coverImage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cover image is required' 
      });
    }
    
    if (!travelImage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Travel image is required' 
      });
    }
    
    // Parse and validate date
    let processedDate = null;
    if (date) {
      // Accept multiple date formats
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid date format' 
        });
      }
      processedDate = dateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    
    const sql = `
      INSERT INTO travel_journals 
      (name, coverUrl, travelImageUrl, description, location, date, category, tags, isActive, featured, author, views, likes, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const values = [
      name || 'Untitled Travel Journal',
      coverImage,
      travelImage,
      description || '',
      location || '',
      date || new Date().toISOString().split('T')[0],
      category || 'adventure',
      tags ? JSON.stringify(Array.isArray(tags) ? tags : (tags ? [tags] : [])) : JSON.stringify([]),
      isActive === 'true' || isActive === true ? 1 : 0,
      featured === 'true' || featured === true ? 1 : 0,
      author || 'TRAVELLO Team',
      views || 0,
      likes || 0
    ];
    
    console.log('SQL values:', values);
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting travel journal:', err);
        console.error('SQL Error:', err.sql);
        console.error('Error details:', err.message);
        return res.status(500).json({ 
          success: false, 
          message: `Database error: ${err.message}` 
        });
      }
      
      console.log('Insert result:', result);
      
      res.json({ 
        success: true, 
        message: 'Travel journal created successfully',
        data: { id: result.insertId }
      });
    });
  } catch (error) {
    console.error('Unexpected error in travel journal creation:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error.message}` 
    });
  }
});

// PUT update travel journal
app.put('/api/travel-journals/:id', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'travelImage', maxCount: 1 }
]), (req, res) => {
  try {
    console.log('=== UPDATE TRAVEL JOURNAL DEBUG ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const { id } = req.params;
    const { 
      name, 
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
    } = req.body;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      console.log('Invalid ID:', id);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid travel journal ID' 
      });
    }
    
    console.log('Processing fields:', {
      name, description, location, date, category, tags, isActive, featured, author, views, likes
    });
    
    // Handle uploaded images
    const coverImage = req.files?.coverImage ? `/uploads/${req.files.coverImage[0].filename}` : null;
    const travelImage = req.files?.travelImage ? `/uploads/${req.files.travelImage[0].filename}` : null;
    
    console.log('Processed images:', { coverImage, travelImage });
    
    // Build dynamic update query
    let updateFields = [];
    let values = [];
    
    // Only update fields that are provided
    if (name !== undefined && name !== null) {
      updateFields.push('name = ?');
      values.push(name);
      console.log('Adding name field:', name);
    }
    if (description !== undefined && description !== null) {
      updateFields.push('description = ?');
      values.push(description);
      console.log('Adding description field:', description);
    }
    if (location !== undefined && location !== null) {
      updateFields.push('location = ?');
      values.push(location);
      console.log('Adding location field:', location);
    }
    if (date !== undefined && date !== null) {
      updateFields.push('date = ?');
      values.push(date);
      console.log('Adding date field:', date);
    }
    if (category !== undefined && category !== null) {
      updateFields.push('category = ?');
      values.push(category);
      console.log('Adding category field:', category);
    }
    if (tags !== undefined && tags !== null) {
      const tagsArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);
      updateFields.push('tags = ?');
      values.push(JSON.stringify(tagsArray));
      console.log('Adding tags field:', tagsArray);
    }
    if (isActive !== undefined) {
      const isActiveValue = isActive === 'true' || isActive === true ? 1 : 0;
      updateFields.push('isActive = ?');
      values.push(isActiveValue);
      console.log('Adding isActive field:', isActiveValue);
    }
    if (featured !== undefined) {
      const featuredValue = featured === 'true' || featured === true ? 1 : 0;
      updateFields.push('featured = ?');
      values.push(featuredValue);
      console.log('Adding featured field:', featuredValue);
    }
    if (author !== undefined && author !== null) {
      updateFields.push('author = ?');
      values.push(author);
      console.log('Adding author field:', author);
    }
    if (views !== undefined && views !== null) {
      const viewsValue = parseInt(views) || 0;
      updateFields.push('views = ?');
      values.push(viewsValue);
      console.log('Adding views field:', viewsValue);
    }
    if (likes !== undefined && likes !== null) {
      const likesValue = parseInt(likes) || 0;
      updateFields.push('likes = ?');
      values.push(likesValue);
      console.log('Adding likes field:', likesValue);
    }
    
    // Always add updatedAt
    updateFields.push('updatedAt = NOW()');
    values.push(parseInt(id));
    
    const sql = `UPDATE travel_journals SET ${updateFields.join(', ')} WHERE id = ?`;
    console.log('Generated SQL:', sql);
    console.log('SQL values:', values);
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('=== DATABASE ERROR ===');
        console.error('SQL Error:', err.sql);
        console.error('Error details:', err.message);
        console.error('Full error object:', err);
        return res.status(500).json({ 
          success: false, 
          message: `Database error: ${err.message}` 
        });
      }
      
      console.log('=== DATABASE RESULT ===');
      console.log('Result:', result);
      console.log('Affected rows:', result.affectedRows);
      
      if (result.affectedRows === 0) {
        console.log('=== NO ROWS AFFECTED ===');
        return res.status(404).json({ 
          success: false, 
          message: 'Travel journal not found or no changes made' 
        });
      }
      
      console.log('=== UPDATE SUCCESS ===');
      res.json({ 
        success: true, 
        message: 'Travel journal updated successfully',
        data: { 
          id: parseInt(id),
          affectedRows: result.affectedRows 
        }
      });
    });
  } catch (error) {
    console.error('=== CATCH ERROR ===');
    console.error('Catch error:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error.message}` 
    });
  }
});

// DELETE travel journal
app.delete('/api/travel-journals/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM travel_journals WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting travel journal:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Travel journal not found' });
    }
    
    res.json({ success: true, message: 'Travel journal deleted successfully' });
  });
});

// Shop Items API Routes

// GET all shop items
app.get('/api/shop-items', (req, res) => {
  const sql = 'SELECT * FROM shop_items ORDER BY createdAt DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching shop items:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    // Parse JSON fields
    const shopItems = results.map(item => ({
      ...item,
      id: item._id, // Map _id to id for frontend compatibility
      details: item.details ? JSON.parse(item.details) : [],
      advantages: item.advantages ? JSON.parse(item.advantages) : [],
      packages: item.packages ? JSON.parse(item.packages) : []
    }));
    
    res.json({ success: true, data: shopItems });
  });
});

// GET shop item by ID
app.get('/api/shop-items/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM shop_items WHERE _id = ?';
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching shop item:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Shop item not found' });
    }
    
    const item = {
      ...results[0],
      id: results[0]._id, // Map _id to id for frontend compatibility
      details: results[0].details ? JSON.parse(results[0].details) : [],
      advantages: results[0].advantages ? JSON.parse(results[0].advantages) : [],
      packages: results[0].packages ? JSON.parse(results[0].packages) : []
    };
    
    res.json({ success: true, data: item });
  });
});

// POST new shop item
app.post('/api/shop-items', upload.single('imageSrc'), (req, res) => {
  try {
    const { 
      title, 
      price, 
      deliveryTime, 
      serviceCategory, 
      status,
      details,
      advantages,
      packages
    } = req.body;
    
    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Title is required' 
      });
    }
    
    if (!price || price.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Price is required' 
      });
    }
    
    if (!serviceCategory || serviceCategory.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Service category is required' 
      });
    }
    
    // Handle uploaded image
    const imageSrc = req.file ? `/uploads/${req.file.filename}` : '/placeholder-image.png';
    
    // Generate unique ID
    const itemId = 'shop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const sql = `
      INSERT INTO shop_items 
      (_id, title, imageSrc, price, deliveryTime, serviceCategory, status, details, advantages, packages, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const values = [
      itemId,
      title || 'Untitled Shop Item',
      imageSrc,
      price || '$0',
      deliveryTime || '',
      serviceCategory || 'Other',
      status === 'inactive' ? 'inactive' : 'active',
      details ? JSON.stringify(Array.isArray(details) ? details : []) : JSON.stringify([]),
      advantages ? JSON.stringify(Array.isArray(advantages) ? advantages : []) : JSON.stringify([]),
      packages ? JSON.stringify(Array.isArray(packages) ? packages : []) : JSON.stringify([])
    ];
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting shop item:', err);
        return res.status(500).json({ 
          success: false, 
          message: `Database error: ${err.message}` 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Shop item created successfully',
        data: { id: itemId }
      });
    });
  } catch (error) {
    console.error('Unexpected error in shop item creation:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error.message}` 
    });
  }
});

// PUT update shop item
app.put('/api/shop-items/:id', upload.single('imageSrc'), (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      price, 
      deliveryTime, 
      serviceCategory, 
      status,
      details,
      advantages,
      packages
    } = req.body;
    
    // Validate ID
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid shop item ID' 
      });
    }
    
    // Build dynamic update query
    let updateFields = [];
    let values = [];
    
    // Only update fields that are provided
    if (title !== undefined && title !== null) {
      updateFields.push('title = ?');
      values.push(title);
    }
    if (req.file) {
      // Handle new image upload
      const imageSrc = `/uploads/${req.file.filename}`;
      updateFields.push('imageSrc = ?');
      values.push(imageSrc);
    }
    if (price !== undefined && price !== null) {
      updateFields.push('price = ?');
      values.push(price);
    }
    if (deliveryTime !== undefined && deliveryTime !== null) {
      updateFields.push('deliveryTime = ?');
      values.push(deliveryTime);
    }
    if (serviceCategory !== undefined && serviceCategory !== null) {
      updateFields.push('serviceCategory = ?');
      values.push(serviceCategory);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      values.push(status === 'inactive' ? 'inactive' : 'active');
    }
    if (details !== undefined) {
      const detailsArray = Array.isArray(details) ? details : (details ? [details] : []);
      updateFields.push('details = ?');
      values.push(JSON.stringify(detailsArray));
    }
    if (advantages !== undefined) {
      const advantagesArray = Array.isArray(advantages) ? advantages : (advantages ? [advantages] : []);
      updateFields.push('advantages = ?');
      values.push(JSON.stringify(advantagesArray));
    }
    if (packages !== undefined) {
      const packagesArray = Array.isArray(packages) ? packages : (packages ? [packages] : []);
      updateFields.push('packages = ?');
      values.push(JSON.stringify(packagesArray));
    }
    
    // Always add updatedAt
    updateFields.push('updatedAt = NOW()');
    values.push(id);
    
    const sql = `UPDATE shop_items SET ${updateFields.join(', ')} WHERE _id = ?`;
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error updating shop item:', err);
        return res.status(500).json({ 
          success: false, 
          message: `Database error: ${err.message}` 
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Shop item not found or no changes made' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Shop item updated successfully',
        data: { 
          id: id,
          affectedRows: result.affectedRows 
        }
      });
    });
  } catch (error) {
    console.error('Unexpected error in shop item update:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error.message}` 
    });
  }
});

// DELETE shop item
app.delete('/api/shop-items/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM shop_items WHERE _id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting shop item:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Shop item not found' });
    }
    
    res.json({ success: true, message: 'Shop item deleted successfully' });
  });
});

// Travel Highlights API (for stories section - simplified version)
app.get('/api/landing-page/travel-highlights', (req, res) => {
  const sql = 'SELECT id, name, coverUrl as cover, travelImageUrl as images, date as timestamp FROM travel_journals WHERE isActive = 1 ORDER BY createdAt DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching travel highlights:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    // Convert travelImageUrl to images array and fix image paths
    const highlights = results.map(highlight => {
      // Fix image paths - convert /api/media/ to /uploads/ for uploaded files
      const fixedCover = highlight.cover ? 
        (highlight.cover.startsWith('/api/media/') ? 
          highlight.cover.replace('/api/media/', '/uploads/') : 
          highlight.cover) : null;
      
      const fixedImages = highlight.images ? 
        (highlight.images.startsWith('/api/media/') ? 
          highlight.images.replace('/api/media/', '/uploads/') : 
          highlight.images) : null;
      
      return {
        ...highlight,
        cover: fixedCover,
        images: fixedImages ? [fixedImages] : []
      };
    });
    
    res.json({ success: true, data: highlights });
  });
});

// Blog Articles API Endpoints

// GET all blog articles
app.get('/api/blog/articles', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status || null;

  let whereClause = '';
  let queryParams = [];

  if (status && ['publish', 'draft'].includes(status)) {
    whereClause = 'WHERE status = ?';
    queryParams.push(status);
  }

  const countQuery = `SELECT COUNT(*) as total FROM blog_articles ${whereClause}`;
  const dataQuery = `
    SELECT 
      id, 
      coverUrl as cover, 
      title, 
      category, 
      status, 
      content,
      createdAt,
      updatedAt
    FROM blog_articles 
    ${whereClause}
    ORDER BY createdAt DESC 
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, queryParams, (err, countResult) => {
    if (err) {
      console.error('Error counting blog articles:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(dataQuery, [...queryParams, limit, offset], (err, articles) => {
      if (err) {
        console.error('Error fetching blog articles:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        articles: articles,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    });
  });
});

// GET single blog article by ID
app.get('/api/blog/articles/:id', (req, res) => {
  const articleId = req.params.id;
  
  const query = `
    SELECT 
      id, 
      coverUrl as cover, 
      title, 
      category, 
      status, 
      content,
      createdAt,
      updatedAt
    FROM blog_articles 
    WHERE id = ?
  `;

  db.query(query, [articleId], (err, results) => {
    if (err) {
      console.error('Error fetching blog article:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(results[0]);
  });
});

// GET blog articles by category
app.get('/api/blog/category/:category', (req, res) => {
  const category = req.params.category;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const countQuery = 'SELECT COUNT(*) as total FROM blog_articles WHERE category = ?';
  const dataQuery = `
    SELECT 
      id, 
      coverUrl as cover, 
      title, 
      category, 
      status, 
      content,
      createdAt,
      updatedAt
    FROM blog_articles 
    WHERE category = ?
    ORDER BY createdAt DESC 
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, [category], (err, countResult) => {
    if (err) {
      console.error('Error counting blog articles by category:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(dataQuery, [category, limit, offset], (err, articles) => {
      if (err) {
        console.error('Error fetching blog articles by category:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        articles: articles,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    });
  });
});

// GET blog categories
app.get('/api/blog/categories', (req, res) => {
  const query = `
    SELECT 
      category,
      COUNT(*) as count
    FROM blog_articles 
    WHERE category IS NOT NULL AND category != ''
    GROUP BY category
    ORDER BY count DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching blog categories:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

// POST new blog article
app.post('/api/blog/articles', (req, res) => {
  const { cover, title, category, status, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const query = `
    INSERT INTO blog_articles (coverUrl, title, category, status, content)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [
    cover || '/placeholder-image.png',
    title,
    category || 'Uncategorized',
    status || 'draft',
    content
  ], (err, result) => {
    if (err) {
      console.error('Error creating blog article:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      id: result.insertId,
      message: 'Article created successfully'
    });
  });
});

// PUT update blog article
app.put('/api/blog/articles/:id', (req, res) => {
  const articleId = req.params.id;
  const { cover, title, category, status, content } = req.body;

  const query = `
    UPDATE blog_articles 
    SET coverUrl = ?, title = ?, category = ?, status = ?, content = ?
    WHERE id = ?
  `;

  db.query(query, [
    cover || '/placeholder-image.png',
    title,
    category || 'Uncategorized',
    status || 'draft',
    content,
    articleId
  ], (err, result) => {
    if (err) {
      console.error('Error updating blog article:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({
      message: 'Article updated successfully'
    });
  });
});

// DELETE blog article
app.delete('/api/blog/articles/:id', (req, res) => {
  const articleId = req.params.id;

  const query = 'DELETE FROM blog_articles WHERE id = ?';

  db.query(query, [articleId], (err, result) => {
    if (err) {
      console.error('Error deleting blog article:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({
      message: 'Article deleted successfully'
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Portfolio API server running on http://localhost:${port}`);
  console.log('Database: travello_db');
  console.log('Tables: portfolios, travel_journals');
  console.log(`Blog API available at http://localhost:${port}/api/blog`);
});
