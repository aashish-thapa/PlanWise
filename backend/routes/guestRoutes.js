import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { sendEmailInvitation } from '../utils/email.js';

const router = express.Router();

// Add Guest
router.post('/', authenticateUser, async (req, res) => {
    const { event_id, name, email } = req.body;
    const db = req.app.get('db');
    const user_id = req.user.id;

    try {
        await db.query('INSERT INTO guests (event_id, name, email, user_id) VALUES (?, ?, ?, ?)', [event_id, name, email, user_id]);
        await sendEmailInvitation(email, name, event_id);
        res.status(201).json({ message: 'Guest added and invited successfully' });
    } catch (error) {
        console.error('Error adding guest:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get all guests for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
    const db = req.app.get('db');
    const user_id = req.user.id;

    try {
        const [guests] = await db.query('SELECT * FROM guests');
        res.json(guests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all guests for a specific event
router.get('/:event_id', authenticateUser, async (req, res) => {
    const { event_id } = req.params;
    const db = req.app.get('db');

    try {
        const [guests] = await db.query('SELECT * FROM guests WHERE event_id = ?', [event_id]);
        res.status(200).json({ guests });
    } catch (error) {
        console.error('Error fetching guests:', error);
        res.status(500).json({ message: 'Error retrieving guests' });
    }
});

// Invite all guests for an event
router.post('/inviteAll', authenticateUser, async (req, res) => {
    const { eventId, emails, name, date, time, location } = req.body;

    try {
        if (!eventId || !emails || !emails.length || !name || !date || !time || !location) {
            return res.status(400).json({ message: "Missing required event details or email list" });
          }
        for (let email of emails) {
            await sendEmailInvitation(email, name, location, date, time); 
        }
        res.status(200).json({ message: "Invitations sent to all guests!" });
    } catch (error) {
        console.error("Error sending invitations:", error);
        res.status(500).json({ message: "Error sending invitations" });
    }
});

// Edit Guest Route
router.put('/:guest_id', authenticateUser, async (req, res) => {
    const { guest_id } = req.params;
    const { name, email } = req.body;
    const db = req.app.get('db');
    
    try {
        // Update guest details
        const result = await db.query('UPDATE guests SET name = ?, email = ? WHERE id = ?', [name, email, guest_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Guest not found' });
        }
        
        res.status(200).json({ message: 'Guest updated successfully' });
    } catch (error) {
        console.error('Error updating guest:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete Guest Route
router.delete('/:guest_id', authenticateUser, async (req, res) => {
    const { guest_id } = req.params;
    const db = req.app.get('db');
    
    try {
        // Delete guest from the database
        const result = await db.query('DELETE FROM guests WHERE id = ?', [guest_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Guest not found' });
        }
        
        res.status(200).json({ message: 'Guest deleted successfully' });
    } catch (error) {
        console.error('Error deleting guest:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
