require('dotenv').config();
require('express-async-errors');
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');

// Configs
const { corsOptions } = require('./config/cors');
const rateLimiter = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const sanitize = require('./middleware/sanitize');
const logger = require('./utils/logger');
const { startCron } = require('./modules/reminders/reminderCron');
const db = require('./config/database');
const { initSocket } = require('./sockets/socketManager');

// Route Imports
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const habitsRoutes = require('./modules/habits/habits.routes');
const logsRoutes = require('./modules/logs/logs.routes');
const streaksRoutes = require('./modules/streaks/streaks.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const gamificationRoutes = require('./modules/gamification/gamification.routes');
const goalsRoutes = require('./modules/goals/goals.routes');
const remindersRoutes = require('./modules/reminders/reminders.routes');
const challengesRoutes = require('./modules/challenges/challenges.routes');
const friendsRoutes = require('./modules/friends/friends.routes');
const notesRoutes = require('./modules/notes/notes.routes');
const exportRoutes = require('./modules/export/export.routes');
const guildsRoutes = require('./modules/guilds/guilds.routes');
const aiRoutes = require('./modules/ai/ai.routes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initSocket(server);

// Base Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(sanitize);
app.use(requestLogger);

// Global Rate Limiter
app.use('/api', rateLimiter('general'));

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/streaks', streaksRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/guilds', guildsRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
server.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}`);
  
  // Test DB connection
  try {
    const client = await db.getClient();
    logger.info('Database connection established successfully.');
    client.release();
  } catch (err) {
    logger.error('Failed to connect to database', err);
  }

  // Start Background Jobs
  startCron();
});

module.exports = { app, server };

// Trigger nodemon restart
