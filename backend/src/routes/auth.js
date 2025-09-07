import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { company_name, email, password } = req.body;
    
    if (!company_name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await query(
      'INSERT INTO manufacturers (company_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, company_name, email',
      [company_name, email, hashedPassword]
    );

    const token = jwt.sign(
      { manufacturerId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      manufacturer: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await query(
      'SELECT id, company_name, email, password_hash FROM manufacturers WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const manufacturer = result.rows[0];
    const validPassword = await bcrypt.compare(password, manufacturer.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { manufacturerId: manufacturer.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      manufacturer: {
        id: manufacturer.id,
        company_name: manufacturer.company_name,
        email: manufacturer.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;