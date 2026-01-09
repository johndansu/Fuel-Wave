import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import entriesRoutes from './routes/entries.js';
import searchRoutes from './routes/search.js';
import insightsRoutes from './routes/insights.js';
import momentsRoutes from './routes/moments.js';
import threadsRoutes from './routes/threads.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : ['http://localhost:5173', 'http://127.0.0.1:5173', /^http:\/\/127\.0\.0\.1:\d+$/],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entriesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/moments', momentsRoutes);
app.use('/api/threads', threadsRoutes);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ForgeOne server running on http://localhost:${PORT}`);
});
