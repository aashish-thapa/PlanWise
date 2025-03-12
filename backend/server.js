import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import eventRoutes from './routes/eventRoutes.js';
import guestRoutes from './routes/guestRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

app.set('db', db);

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Event Planner API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
