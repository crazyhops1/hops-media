import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND 
  },
});

export const onlineUsers = []


io.on('connection', (socket) => {
 
  const userid = socket.handshake.query.userid;

  if (userid) {
    // Check if the user already exists in the array
    const existingUser = onlineUsers.find(user => user.userid === userid);
    if (!existingUser) {
      // Store the user with their socket ID if not already in the array
      onlineUsers.push({ userid, socketId: socket.id });

      // Emit the 'connectedUser' event to the connecting user (not to everyone)
      socket.emit('connectedUser', { onlineUsers });
    } else {
      console.log(`User ${userid} is already connected`);
    }
  } else {
    socket.disconnect(); // Disconnect the socket if no userid is provided
  }

  // Handle disconnect event and clean up
  socket.on('disconnect', () => {
    const index = onlineUsers.findIndex(user => user.socketId === socket.id);
    if (index !== -1) {
      const disconnectedUser = onlineUsers[index];
      onlineUsers.splice(index, 1); // Remove user from the online users array


      // Notify other users that this user disconnected
      socket.emit('disconnectedUser', onlineUsers); // Emit to all other clients
    }
  });
});

// Export the necessary components
export { io, server, app };
