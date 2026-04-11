#!/bin/bash
# Database setup script for MySQL integration (alternative to Supabase)

# MySQL credentials (set these before running)
DB_HOST=${DB_HOST:-localhost}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-password}
DB_NAME=${DB_NAME:-templatemart}

echo "Creating MySQL database and tables for TemplateMart..."

# Create database
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

# Create tables
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME << 'EOF'

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('simple', 'complex') NOT NULL DEFAULT 'simple',
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  config JSON,
  preview_url TEXT,
  preview_type ENUM('image', 'video', 'iframe') DEFAULT 'image',
  component_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  features JSON,
  demo_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_category (category),
  INDEX idx_active (is_active)
);

-- User pages table
CREATE TABLE IF NOT EXISTS user_pages (
  id VARCHAR(36) PRIMARY KEY,
  template_id VARCHAR(36) NOT NULL,
  unique_slug VARCHAR(255) UNIQUE NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  user_data JSON,
  payment_id VARCHAR(255),
  view_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  INDEX idx_slug (unique_slug),
  INDEX idx_template (template_id)
);

-- Template requests table
CREATE TABLE IF NOT EXISTS template_requests (
  id VARCHAR(36) PRIMARY KEY,
  template_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  user_phone VARCHAR(20),
  message TEXT,
  status ENUM('pending', 'contacted', 'completed', 'cancelled') DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_template (template_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  template_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'INR',
  status ENUM('created', 'pending', 'successful', 'failed') DEFAULT 'created',
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  page_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (template_id) REFERENCES templates(id),
  FOREIGN KEY (page_id) REFERENCES user_pages(id),
  INDEX idx_order (razorpay_order_id),
  INDEX idx_status (status)
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('super_admin', 'admin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

echo "✅ Database tables created successfully!"
echo ""
echo "Next steps:"
echo "1. Set up environment variables in .env.local"
echo "2. Create src/lib/mysql.ts for database connections"
echo "3. Update API handlers to use MySQL instead of Supabase"
EOF
