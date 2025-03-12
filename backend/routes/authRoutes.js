import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const db = req.app.get('db');

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = req.app.get('db');

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, users[0].password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: users[0].id, email: users[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
