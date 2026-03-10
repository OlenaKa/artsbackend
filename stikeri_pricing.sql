-- Create stikeri_pricing table for storing sticker foil pricing
CREATE TABLE IF NOT EXISTS stikeri_pricing (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  foil_type VARCHAR(50) NOT NULL UNIQUE,
  price_per_sq_cm DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial pricing data
INSERT INTO stikeri_pricing (foil_type, price_per_sq_cm, description) VALUES
('bela', 2.2, 'White foil - 2.2 per cm²'),
('gold', 2.7, 'Gold foil - 2.7 per cm²');
