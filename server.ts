import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDbStatus } from './server/config/db';
import { seedDatabase } from './server/seed';
import authRoutes from './server/routes/authRoutes';
import postRoutes from './server/routes/postRoutes';
import commentRoutes from './server/routes/commentRoutes';
import userRoutes from './server/routes/userRoutes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// System & Database Health Check API
app.get('/api/status', (_req: Request, res: Response) => {
  const dbStatus = getDbStatus();
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'BlogNest API Server',
    database: dbStatus,
  });
});

// 404 handler for unmatched API requests
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

// Global Express error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred',
  });
});

async function startServer() {
  try {
    // 1. Connect to Database (Atlas or local in-memory fallback)
    await connectDB();

    // 2. Auto-seed sample data if database is empty
    await seedDatabase();

    // 3. Vite middleware for development or static serving for production
    if (!isProduction) {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite development middleware mounted successfully.');
    } else {
      const distPath = path.resolve(__dirname, 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }

    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`===============================================`);
      console.log(`BlogNest Server running on http://0.0.0.0:${PORT}`);
      console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
      console.log(`API Base: http://0.0.0.0:${PORT}/api`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start BlogNest server:', error);
    process.exit(1);
  }
}

startServer();
