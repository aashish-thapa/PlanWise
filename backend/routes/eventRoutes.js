import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Event
router.post('/', authenticateUser, async (req, res) => {
    const { name, date, location } = req.body;
    const db = req.app.get('db');

    try {
        await db.query('INSERT INTO events (user_id, name, date, location) VALUES (?, ?, ?, ?)', 
                      [req.user.id, name, date, location]);
        res.status(201).json({ message: 'Event created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get User Events
router.get('/', authenticateUser, async (req, res) => {
    const db = req.app.get('db');

    try {
        const [events] = await db.query('SELECT * FROM events WHERE user_id = ?', [req.user.id]);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Event
router.delete('/:id', authenticateUser, async (req, res) => {
    const db = req.app.get('db');

    try {
        await db.query('DELETE FROM events WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
