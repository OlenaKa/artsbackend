import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { testConnection } from './config/database';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server and test database connection
const startServer = async () => {
  try {
    console.log('========================================');
    console.log('🟢 Server starting...');
    console.log(`[ENV CHECK] DB_HOST present: ${Boolean(process.env.DB_HOST)}`);
    console.log('🔌 Attempting database connection...');
    await testConnection();
    console.log('✅ Database connection successful!');
    console.log('🚀 Starting HTTP server...');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('========================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
