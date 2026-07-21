const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

module.exports = {
  init: (httpServer) => {
    io = socketIo(httpServer, {
      cors: {
        origin: '*', // Adjust for production
        methods: ['GET', 'POST']
      }
    });

    io.use((socket, next) => {
      if (socket.handshake.auth && socket.handshake.auth.token) {
        jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET || 'secret123', (err, decoded) => {
          if (err) return next(new Error('Authentication error'));
          socket.userId = decoded.id;
          socket.teamId = decoded.teamId;
          next();
        });
      } else {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.userId}`);
      
      // Join a room for personal notifications
      socket.join(socket.userId);
      // Join a room for team notifications
      if (socket.teamId) {
        socket.join(`team_${socket.teamId}`);
      }

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
      });
    });

    return io;
  },
  getIo: () => {
    if (!io) throw new Error('Socket.io not initialized!');
    return io;
  }
};
