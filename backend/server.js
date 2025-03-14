import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import eventRoutes from './routes/eventRoutes.js';
import guestRoutes from './routes/guestRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: "https://event-planner-7o83.vercel.app", // Allow specific frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(bodyParser.json());

// Database connection
let db; // Declare db here to use in the whole file
try {
    db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DBPORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });
    console.log('Connected to the database');
    app.set('db', db);
} catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process if the DB connection fails
}

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Event Planner API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
