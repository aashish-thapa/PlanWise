import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add Expense
router.post('/', authenticateUser, async (req, res) => {
    const { event_id, description, amount, category } = req.body;
    const db = req.app.get('db');
    const user_id = req.user.id; // Assuming req.user.id is the authenticated user's ID

    try {
        const result = await db.query(
            'INSERT INTO expenses (event_id, description, amount, category, user_id) VALUES (?, ?, ?, ?, ?)',
            [event_id, description, amount, category, user_id]
        );

        res.status(201).json({
            id: result.insertId,
            event_id,
            description,
            amount,
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all expenses for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
    const db = req.app.get('db');

    try {
        const [expenses] = await db.query('SELECT * FROM expenses');
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Expenses for a specific event
router.get('/:event_id', authenticateUser, async (req, res) => {
    const db = req.app.get('db');
    const { event_id } = req.params;

    try {
        const [expenses] = await db.query('SELECT * FROM expenses WHERE event_id = ?', [event_id]);

        if (!expenses.length) {
            return res.status(404).json({ message: 'No expenses found for this event.' });
        }

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Edit an expense
router.put('/:expense_id', authenticateUser, async (req, res) => {
    const { expense_id } = req.params;
    const { description, amount, category } = req.body;
    const db = req.app.get('db');
    const user_id = req.user.id;

    try {
        const [existingExpense] = await db.query('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [expense_id, user_id]);

        if (!existingExpense.length) {
            return res.status(404).json({ message: 'Expense not found or you do not have permission to edit it.' });
        }

        // Update the expense in the database
        await db.query(
            'UPDATE expenses SET description = ?, amount = ?, category = ? WHERE id = ?',
            [description, amount, category, expense_id]
        );

        res.status(200).json({ message: 'Expense updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an expense
router.delete('/:expense_id', authenticateUser, async (req, res) => {
    const { expense_id } = req.params;
    const db = req.app.get('db');
    const user_id = req.user.id;

    try {
        const [existingExpense] = await db.query('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [expense_id, user_id]);

        if (!existingExpense.length) {
            return res.status(404).json({ message: 'Expense not found or you do not have permission to delete it.' });
        }

        // Delete the expense from the database
        await db.query('DELETE FROM expenses WHERE id = ?', [expense_id]);

        res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
