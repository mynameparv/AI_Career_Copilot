import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// MongoDB REMOVED - Using local JSON storage now
import connectDB from './config/db.js';
// Redis client is initialized in config/redis.js, we import it to ensure it connects
// COMMENTED OUT - Redis disabled for now
// import './config/redis.js';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

// MongoDB connection
connectDB();

const app = express();

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('   Headers:', req.headers.authorization ? 'Has Auth' : 'No Auth');
    next();
});

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://careerhelpprojects.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());

import resumeRoutes from './routes/resumeRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Test endpoint
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date() });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
