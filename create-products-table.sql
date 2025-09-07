-- Drop existing table if needed (uncomment if you want to recreate)
-- DROP TABLE IF EXISTS products CASCADE;

-- Create products table for storing manufacturer product data
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    manufacturing_date DATE NOT NULL,
    model_number VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on product_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow public insert access" ON products;

-- Create policy to allow public read access (for verification)
CREATE POLICY "Allow public read access" ON products
    FOR SELECT USING (true);

-- Create policy to allow public insert access (for registration)
CREATE POLICY "Allow public insert access" ON products
    FOR INSERT WITH CHECK (true);

-- Verify table creation
SELECT 'Products table created successfully!' as status;