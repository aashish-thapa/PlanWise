import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Event
router.post('/', authenticateUser, async (req, res) => {
    const { name, date, location, imageUrl } = req.body; // Add imageUrl
    const db = req.app.get('db');

    try {
        // Insert event with imageUrl
        await db.query('INSERT INTO events (user_id, name, date, location, image_url) VALUES (?, ?, ?, ?, ?)', 
                      [req.user.id, name, date, location, imageUrl]);
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

router.get('/:id', async (req, res) => {
    const db = req.app.get('db');
    try {
        const eventId = req.params.id;
        const query = "SELECT * FROM events WHERE id = ?";
        const [event] = await db.execute(query, [eventId]);

        if (event.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event[0]); // Return the first event (since ID is unique)
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update Event
router.put('/:id', authenticateUser, async (req, res) => {
    const { name, date, location, imageUrl } = req.body; // Add imageUrl
    const db = req.app.get('db');
    const eventId = req.params.id;

    try {
        // Check if event exists
        const [event] = await db.query('SELECT * FROM events WHERE id = ? AND user_id = ?', [eventId, req.user.id]);
        if (event.length === 0) {
            return res.status(404).json({ message: "Event not found or you do not have permission to update this event" });
        }

        // Update the event
        await db.query('UPDATE events SET name = ?, date = ?, location = ?, image_url = ? WHERE id = ? AND user_id = ?',
                       [name, date, location, imageUrl, eventId, req.user.id]);

        res.json({ message: 'Event updated successfully' });
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
