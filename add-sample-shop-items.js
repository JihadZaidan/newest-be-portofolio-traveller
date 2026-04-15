const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travello_db',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to travello_db database');

  // Sample shop items
  const sampleItems = [
    {
      _id: 'shop_001',
      title: 'I will be SEO content writer for article writing or blog writing',
      imageSrc: '/bg-shopCards.jpg',
      price: '$20',
      deliveryTime: '2 Days Delivery',
      serviceCategory: 'SEO Content',
      status: 'active',
      details: JSON.stringify([{
        id: 1,
        fullText: 'Hello, I am Rizqi, a professional SEO content writer with 7 years of industry experience. I hold an MBA degree and specialize in creating content that not only informs but drives results.'
      }]),
      advantages: JSON.stringify([
        { id: 1, title: 'Highly Responsive', subtitle: 'Known for exceptionally quick replies' },
        { id: 2, title: 'SEO Optimized', subtitle: 'Content crafted to rank better on search engines' }
      ]),
      packages: JSON.stringify([
        {
          id: 1,
          packageKey: 'basic',
          badge: 'Starter',
          description: 'Short-form SEO content for quick tasks and smaller projects.',
          features: ['1 Article', 'SEO-optimized title', 'Proofreading'],
          defaultWords: 500,
          basePrice: 20
        }
      ])
    },
    {
      _id: 'shop_002',
      title: 'I will write human SEO blogs and articles',
      imageSrc: '/bg-shopCards.jpg',
      price: '$100',
      deliveryTime: '3 Days Delivery',
      serviceCategory: 'Blog Writing',
      status: 'active',
      details: JSON.stringify([]),
      advantages: JSON.stringify([]),
      packages: JSON.stringify([])
    },
    {
      _id: 'shop_003',
      title: 'I will write SEO blog posts and articles as your content writer',
      imageSrc: '/bg-shopCards.jpg',
      price: '$150',
      deliveryTime: '7 Days Delivery',
      serviceCategory: 'Product Description',
      status: 'inactive',
      details: JSON.stringify([]),
      advantages: JSON.stringify([]),
      packages: JSON.stringify([])
    }
  ];

  // Insert sample items
  const sql = `
    INSERT INTO shop_items 
    (_id, title, imageSrc, price, deliveryTime, serviceCategory, status, details, advantages, packages, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  sampleItems.forEach((item, index) => {
    const values = [
      item._id,
      item.title,
      item.imageSrc,
      item.price,
      item.deliveryTime,
      item.serviceCategory,
      item.status,
      item.details,
      item.advantages,
      item.packages
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(`Error inserting item ${index + 1}:`, err);
      } else {
        console.log(`Sample shop item ${index + 1} inserted successfully`);
      }
    });
  });

  // Close connection after a delay
  setTimeout(() => {
    db.end((err) => {
      if (err) {
        console.error('Error closing connection:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }, 2000);
});
