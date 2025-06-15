let io;

const connectedUsers = {};

const initSocket = (server) => {
  const socketIO = require('socket.io')(server, {
    cors: { origin: '*' }
  });

  io = socketIO;

  socketIO.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('register', (userId) => {
      connectedUsers[userId] = socket.id;
      socket.join(userId); // Join a room with user ID
    });

    socket.on('disconnect', () => {
      for (const [key, value] of Object.entries(connectedUsers)) {
        if (value === socket.id) {
          delete connectedUsers[key];
          break;
        }
      }
      console.log('Socket disconnected:', socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO, io: { to: (room) => getIO().to(room) } };
