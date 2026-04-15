-- Create portfolios table if it doesn't exist
CREATE TABLE IF NOT EXISTS portfolios (
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

-- Insert some sample data
INSERT INTO portfolios (title, description, category, images, tags, featured, published, orderIndex) VALUES
('Sample Portfolio 1', 'This is a sample portfolio item', 'product-description', 
 '["/uploads/sample1.jpg", "/uploads/sample2.jpg"]', 
 '["design", "branding"]', TRUE, TRUE, 1),
('Sample Portfolio 2', 'Another sample portfolio', 'social-media', 
 '["/uploads/sample3.jpg"]', 
 '["social", "marketing"]', TRUE, TRUE, 2);
