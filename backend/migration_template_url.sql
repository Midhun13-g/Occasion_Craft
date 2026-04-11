-- Migration: Replace component_name with template_url
-- Date: 2024

-- Step 1: Add new column template_url
ALTER TABLE templates 
ADD COLUMN template_url TEXT NOT NULL DEFAULT 'https://example.com/template';

-- Step 2: Migrate existing data (optional - update with actual URLs if needed)
-- UPDATE templates SET template_url = CONCAT('https://templates.example.com/', component_name);

-- Step 3: Drop old column component_name
ALTER TABLE templates 
DROP COLUMN component_name;

-- Step 4: Remove default constraint (optional, for cleaner schema)
ALTER TABLE templates 
ALTER COLUMN template_url DROP DEFAULT;
