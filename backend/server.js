const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/auth/auth.routes');
const { errorHandler } = require('./src/middleware/errorHandler');
const db = require('./src/config/database');
const { runMigrations } = require('./src/config/migrate');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'cloud-hosting-auth'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await db.query('SELECT 1');
    logger.info('Database connection established');
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}. Check DB_* values in backend/.env and that PostgreSQL is running.`);
    process.exit(1);
  }

  try {
    const applied = await runMigrations(db);
    logger.info(applied.length ? `Migrations applied: ${applied.join(', ')}` : 'Database schema up to date');
  } catch (error) {
    logger.error(`${error.message}. Fix the database or run the SQL in backend/migrations manually (see README).`);
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} (${process.env.NODE_ENV})`);
  });
};

if (require.main === module) startServer();

module.exports = app;
