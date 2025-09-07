import fs from 'fs';
import { pool } from '../src/db.js';

async function migrate() {
  try {
    console.log('Running database migrations...');
    
    const sql = fs.readFileSync('./migrations.sql', 'utf8');
    await pool.query(sql);
    
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();