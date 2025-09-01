'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle room joining
  socket.on('join room', ({ room, nickname }) => {
    socket.join(room);
    socket.room = room;
    socket.nickname = nickname;
    console.log(`${nickname} joined room: ${room}`);

    io.to(room).emit('system message', `${nickname} joined the room.`);
  });

  // Handle chat message
  socket.on('chat message', ({ room, nickname, message }) => {
    console.log(`[${room}] ${nickname}: ${message}`);
    io.to(room).emit('chat message', { nickname, message });
  });
  
 // Handle image uploads (placeholder)
socket.on('image message', ({ room, nickname, fileName }) => {
  console.log(`[${room}] ${nickname} is sending an image: ${fileName}`);
  io.to(room).emit('system message', `${nickname} is sending an image: ${fileName}`);
});

// Handle audio uploads (placeholder)
socket.on('audio message', ({ room, nickname, fileName }) => {
  console.log(`[${room}] ${nickname} is sending an audio file: ${fileName}`);
  io.to(room).emit('system message', `${nickname} is sending an audio file: ${fileName}`);
});

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.room && socket.nickname) {
      io.to(socket.room).emit('system message', `${socket.nickname} left the room.`);
    }
    console.log('User disconnected:', socket.id);
  });
});

http.listen(3000, () => {
  console.log('Listening on port 3000');
});
