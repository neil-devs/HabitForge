const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

let io;

// Map of userId -> socket.id to keep track of connected users
const connectedUsers = new Map();

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication Middleware
  io.use((socket, next) => {
    try {
      // Tokens could be sent in auth payload or headers
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-jwt-key');
      socket.user = decoded;
      next();
    } catch (error) {
      logger.error('Socket authentication failed:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected to socket: ${socket.user.id} (${socket.id})`);
    
    // Store connection
    connectedUsers.set(socket.user.id, socket.id);

    // Join a personal room for targeted events
    socket.join(`user_${socket.user.id}`);
    
    // Join a global room for public feed
    socket.join('global_feed');

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user.id}`);
      connectedUsers.delete(socket.user.id);
    });

    // Add generic test event
    socket.on('ping', (cb) => {
      if(typeof cb === 'function') cb('pong');
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};

// Utility to emit to specific users (e.g. friends)
const emitToUser = (userId, event, payload) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, payload);
  }
};

// Utility to emit globally
const emitGlobal = (event, payload) => {
  if (io) {
    io.to('global_feed').emit(event, payload);
  }
};

module.exports = {
  initSocket,
  getIo,
  emitToUser,
  emitGlobal,
  connectedUsers
};
