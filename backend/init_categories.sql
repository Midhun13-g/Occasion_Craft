-- Create categories table if not exists
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(10) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (id, name, slug, description, icon, is_active, created_at, updated_at) VALUES
(UUID(), 'Birthday', 'birthday', 'Birthday celebration templates', '🎂', TRUE, NOW(), NOW()),
(UUID(), 'Wedding', 'wedding', 'Wedding invitation and celebration templates', '💒', TRUE, NOW(), NOW()),
(UUID(), 'Anniversary', 'anniversary', 'Anniversary celebration templates', '💝', TRUE, NOW(), NOW()),
(UUID(), 'Business', 'business', 'Business cards and professional templates', '💼', TRUE, NOW(), NOW()),
(UUID(), 'Invitation', 'invitation', 'Event invitation templates', '✉️', TRUE, NOW(), NOW()),
(UUID(), 'Greeting', 'greeting', 'Greeting card templates', '🎉', TRUE, NOW(), NOW()),
(UUID(), 'Portfolio', 'portfolio', 'Portfolio and showcase templates', '📁', TRUE, NOW(), NOW()),
(UUID(), 'Resume', 'resume', 'Resume and CV templates', '📄', TRUE, NOW(), NOW()),
(UUID(), 'Certificate', 'certificate', 'Certificate and award templates', '🏆', TRUE, NOW(), NOW()),
(UUID(), 'Social Media', 'social-media', 'Social media post templates', '📱', TRUE, NOW(), NOW()),
(UUID(), 'Event', 'event', 'Event announcement templates', '🎪', TRUE, NOW(), NOW()),
(UUID(), 'Other', 'other', 'Other miscellaneous templates', '📦', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;
