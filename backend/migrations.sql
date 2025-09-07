-- Create database schema for BlockAuthentic

-- Manufacturers table
CREATE TABLE IF NOT EXISTS manufacturers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
    id SERIAL PRIMARY KEY,
    manufacturer_id INTEGER REFERENCES manufacturers(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    merkle_root VARCHAR(64),
    manifest_url VARCHAR(500),
    anchor_tx_hash VARCHAR(66),
    anchor_block INTEGER,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'printed', 'anchored', 'anchor_failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    pid VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'created' CHECK (status IN ('created', 'applied', 'verified', 'revoked')),
    applied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scan events table
CREATE TABLE IF NOT EXISTS scan_events (
    id SERIAL PRIMARY KEY,
    pid VARCHAR(20) REFERENCES products(pid) ON DELETE CASCADE,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('applied', 'verify_success', 'verify_failed', 'verify_revoked')),
    device_fingerprint VARCHAR(255),
    operator_id VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Print manifests table
CREATE TABLE IF NOT EXISTS print_manifests (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    printed_roll_id VARCHAR(100) NOT NULL,
    printed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_pid ON products(pid);
CREATE INDEX IF NOT EXISTS idx_products_batch_id ON products(batch_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_pid ON scan_events(pid);
CREATE INDEX IF NOT EXISTS idx_scan_events_created_at ON scan_events(created_at);
CREATE INDEX IF NOT EXISTS idx_batches_manufacturer_id ON batches(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_manufacturers_updated_at BEFORE UPDATE ON manufacturers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();