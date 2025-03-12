import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add Expense
router.post('/', authenticateUser, async (req, res) => {
    const { event_id, description, amount, category } = req.body;
    const db = req.app.get('db');

    try {
        await db.query('INSERT INTO expenses (event_id, description, amount, category) VALUES (?, ?, ?, ?)',
                      [event_id, description, amount, category]);
        res.status(201).json({ message: 'Expense added' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Expenses
router.get('/:event_id', authenticateUser, async (req, res) => {
    const db = req.app.get('db');

    try {
        const [expenses] = await db.query('SELECT * FROM expenses WHERE event_id = ?', [req.params.event_id]);
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
