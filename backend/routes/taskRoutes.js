import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add Task
router.post('/', authenticateUser, async (req, res) => {
    const { event_id, title, description, due_date } = req.body;
    const db = req.app.get('db');
    const user_id = req.user.id;

    try {
        await db.query('INSERT INTO tasks (event_id, user_id, title, description, due_date) VALUES (?, ?, ?, ?, ?)', 
            [event_id, user_id, title, description, due_date]);
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get all tasks for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
    const db = req.app.get('db');
    const user_id = req.user.id;

    try {
        const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [user_id]);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all tasks for a specific event
router.get('/:event_id', authenticateUser, async (req, res) => {
    const { event_id } = req.params;
    const db = req.app.get('db');

    try {
        const [tasks] = await db.query('SELECT * FROM tasks WHERE event_id = ?', [event_id]);
        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error retrieving tasks' });
    }
});

// Edit Task Route
router.put('/:task_id', authenticateUser, async (req, res) => {
    const { task_id } = req.params;
    const { title, description, due_date } = req.body;
    const db = req.app.get('db');
    
    try {
        const result = await db.query('UPDATE tasks SET title = ?, description = ?, due_date = ? WHERE id = ?', 
            [title, description, due_date, task_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete Task Route
router.delete('/:task_id', authenticateUser, async (req, res) => {
    const { task_id } = req.params;
    const db = req.app.get('db');
    
    try {
        const result = await db.query('DELETE FROM tasks WHERE id = ?', [task_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
