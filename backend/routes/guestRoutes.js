import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { sendEmailInvitation } from '../utils/email.js';

const router = express.Router();

// Add Guest
router.post('/', authenticateUser, async (req, res) => {
    const { event_id, name, email } = req.body;
    const db = req.app.get('db');

    try {
        await db.query('INSERT INTO guests (event_id, name, email) VALUES (?, ?, ?)', [event_id, name, email]);
        sendEmailInvitation(email, name, event_id);
        res.status(201).json({ message: 'Guest added and invited' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
