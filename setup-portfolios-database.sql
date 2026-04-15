-- Database: travello_db
-- Table: portfolios

-- Drop existing table if needed
DROP TABLE IF EXISTS portfolios;

-- Create portfolios table
CREATE TABLE portfolios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'product-description',
  images JSON,
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
);

-- Insert sample data
INSERT INTO portfolios (title, description, category, images, tags, featured, published, orderIndex) VALUES
('Williams Sonoma Lunar Dinnerware Set', 'Elegant dinnerware set with lunar-inspired design perfect for special occasions', 'product-description', 
'["/Williams-Sonoma-Lunar.png"]', 
'["product-design", "dinnerware", "elegant"]', 
TRUE, TRUE, 1),

('Dr. Bronner\'s Pure Castile Peppermint', 'Organic pure castile soap with refreshing peppermint scent, gentle on skin', 'product-description', 
'["/Dr-Bronners-Pure.png"]', 
'["organic", "soap", "peppermint"]', 
TRUE, TRUE, 2),

('Summer Vibes Collection', 'Social media campaign featuring summer-themed content with vibrant colors and tropical elements', 'social-media', 
'["/Sudio-K2.png"]', 
'["summer", "vibrant", "tropical"]', 
TRUE, TRUE, 1),

('Viral Travel Series', 'Travel photography series that went viral on social media platforms', 'social-media', 
'["/Alphalete-Elite.png"]', 
'["travel", "viral", "photography"]', 
TRUE, TRUE, 2),

('SaaS Product Launch Page', 'Modern landing page design for software-as-a-service product launch', 'landing-page', 
'["/flowtrack.png"]', 
'["saas", "landing-page", "modern"]', 
TRUE, TRUE, 1),

('Fashion Brand Homepage', 'Elegant homepage design for luxury fashion brand with minimalist aesthetic', 'landing-page', 
'["/truebotanicals.png"]', 
'["fashion", "luxury", "minimalist"]', 
TRUE, TRUE, 2),

('High-Converting Ad Campaign', 'Digital advertising campaign with exceptional conversion rates and engagement', 'ads-copy', 
'["/image-ads-copy.jpg"]', 
'["high-converting", "ads", "campaign"]', 
TRUE, TRUE, 1),

('Retargeting Campaign Copy', 'Strategic retargeting campaign copy designed to re-engage potential customers', 'ads-copy', 
'["/image-ads-copy2.jpg"]', 
'["retargeting", "campaign", "strategic"]', 
TRUE, TRUE, 2),

('Hidden Gems of Southeast Asia', 'Travel article showcasing undiscovered destinations across Southeast Asia', 'articles', 
'["/image-article.jpg"]', 
'["travel", "southeast-asia", "hidden-gems"]', 
TRUE, TRUE, 1),

('The Art of Slow Travel', 'Philosophical approach to travel emphasizing depth over breadth of experience', 'articles', 
'["/image-article2.jpg"]', 
'["slow-travel", "philosophy", "experience"]', 
TRUE, TRUE, 2),

('Weekly Travel Digest', 'Curated weekly newsletter featuring travel tips and destination highlights', 'email', 
'["/image-email.jpeg"]', 
'["newsletter", "weekly", "travel-tips"]', 
TRUE, TRUE, 1),

('Flash Sale Campaign', 'Time-sensitive promotional email campaign with limited-time offers', 'email', 
'["/image-email2.jpeg"]', 
'["flash-sale", "campaign", "promotional"]', 
TRUE, TRUE, 2);

-- Show the created table structure
DESCRIBE portfolios;
