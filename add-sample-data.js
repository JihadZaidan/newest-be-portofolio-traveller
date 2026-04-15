const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travello_db'
});

const sampleData = [
  {
    title: 'Product Description Copy',
    description: 'Example portfolio item for product description copy froms admin panel.',
    category: 'product-description',
    images: JSON.stringify(['/Williams-Sonoma-Lunar.png']),
    tags: JSON.stringify(['Product Description', 'Ecommerce']),
    featured: true,
    published: true,
    orderIndex: 1
  },
  {
    title: 'Social Media Campaign',
    description: 'Example portfolio item for social media content.',
    category: 'social-media',
    images: JSON.stringify(['/Sudio-K2.png']),
    tags: JSON.stringify(['Social Media', 'Campaign']),
    featured: true,
    published: true,
    orderIndex: 2
  }
];

db.connect((err) => {
  if (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
  
  console.log('Adding sample data to portfolios table...');
  
  sampleData.forEach((item, index) => {
    const sql = `INSERT INTO portfolios (title, description, category, images, tags, featured, published, orderIndex, createdBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const values = [
      item.title,
      item.description,
      item.category,
      item.images,
      item.tags,
      item.featured,
      item.published,
      item.orderIndex,
      'admin'
    ];
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting item', index + ':', err);
      } else {
        console.log('Successfully inserted item', index + 'with ID:', result.insertId);
      }
    });
  });
  
  db.end(() => {
    console.log('Database connection closed');
    console.log('Sample data added successfully!');
  });
});
