-- Create portfolios table with correct column names
CREATE TABLE IF NOT EXISTS portfolios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'product-description',
  imageUrl VARCHAR(500),
  projectUrl VARCHAR(500),
  technologies JSON,
  tags JSON,
  featured BOOLEAN DEFAULT TRUE,
  isActive BOOLEAN DEFAULT TRUE,
  client VARCHAR(255),
  projectDate DATE,
  author VARCHAR(255) DEFAULT 'admin',
  views INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO portfolios (title, description, category, imageUrl, projectUrl, technologies, tags, featured, isActive, client, projectDate) VALUES
('Product Description Copy', 'Example portfolio item for product description copy from admin panel.', 'product-description', 
'/Williams-Sonoma-Lunar.png', '', 
'["product-design", "ecommerce"]', 
'["Product Description", "Ecommerce"]', 
TRUE, TRUE, 'Admin Client', '2024-01-15'),

('Social Media Campaign', 'Example portfolio item for social media content.', 'social-media', 
'/Sudio-K2.png', '', 
'["social-media", "campaign"]', 
'["Social Media", "Campaign"]', 
TRUE, TRUE, 'Admin Client', '2024-01-20');
