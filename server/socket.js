// server/socket.js
let io = null;

module.exports = {
  init: (server, options = {}) => {
    const { Server } = require('socket.io');
    io = new Server(server, Object.assign({
      cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000' }
    }, options));
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
    });
    return io;
  },
  getIO: () => io
};
