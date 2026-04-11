-- Run this SQL script in your MySQL database (occasion_dp)

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(10) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories
INSERT INTO categories (id, name, slug, description, icon, is_active, created_at, updated_at) VALUES
('cat-birthday-001', 'Birthday', 'birthday', 'Birthday celebration templates', '🎂', TRUE, NOW(), NOW()),
('cat-wedding-002', 'Wedding', 'wedding', 'Wedding invitation and celebration templates', '💒', TRUE, NOW(), NOW()),
('cat-anniversary-003', 'Anniversary', 'anniversary', 'Anniversary celebration templates', '💝', TRUE, NOW(), NOW()),
('cat-business-004', 'Business', 'business', 'Business cards and professional templates', '💼', TRUE, NOW(), NOW()),
('cat-invitation-005', 'Invitation', 'invitation', 'Event invitation templates', '✉️', TRUE, NOW(), NOW()),
('cat-greeting-006', 'Greeting', 'greeting', 'Greeting card templates', '🎉', TRUE, NOW(), NOW()),
('cat-portfolio-007', 'Portfolio', 'portfolio', 'Portfolio and showcase templates', '📁', TRUE, NOW(), NOW()),
('cat-resume-008', 'Resume', 'resume', 'Resume and CV templates', '📄', TRUE, NOW(), NOW()),
('cat-certificate-009', 'Certificate', 'certificate', 'Certificate and award templates', '🏆', TRUE, NOW(), NOW()),
('cat-social-media-010', 'Social Media', 'social-media', 'Social media post templates', '📱', TRUE, NOW(), NOW()),
('cat-event-011', 'Event', 'event', 'Event announcement templates', '🎪', TRUE, NOW(), NOW()),
('cat-other-012', 'Other', 'other', 'Other miscellaneous templates', '📦', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Verify the data
SELECT * FROM categories;
