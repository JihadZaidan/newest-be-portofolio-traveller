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
    imageUrl: '/Williams-Sonoma-Lunar.png',
    projectUrl: '',
    technologies: JSON.stringify(['product-design', 'ecommerce']),
    tags: JSON.stringify(['Product Description', 'Ecommerce']),
    featured: true,
    isActive: true,
    client: 'Admin Client',
    projectDate: '2024-01-15'
  },
  {
    title: 'Social Media Campaign',
    description: 'Example portfolio item for social media content.',
    category: 'social-media',
    imageUrl: '/Sudio-K2.png',
    projectUrl: '',
    technologies: JSON.stringify(['social-media', 'campaign']),
    tags: JSON.stringify(['Social Media', 'Campaign']),
    featured: true,
    isActive: true,
    client: 'Admin Client',
    projectDate: '2024-01-20'
  }
];

db.connect((err) => {
  if (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
  
  console.log('Adding sample data to portfolios table...');
  
  sampleData.forEach((item, index) => {
    const sql = `INSERT INTO portfolios (title, description, category, imageUrl, projectUrl, technologies, tags, featured, isActive, client, projectDate, author, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const values = [
      item.title,
      item.description,
      item.category,
      item.imageUrl,
      item.projectUrl,
      item.technologies,
      item.tags,
      item.featured,
      item.isActive,
      item.client,
      item.projectDate,
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
