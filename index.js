'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('join room', ({ room, nickname }) => {
    socket.join(room);
    socket.room = room;
    socket.nickname = nickname;
    console.log(`${nickname} joined room: ${room}`);
    io.to(room).emit('system message', `${nickname} joined the room.`);
  });

  // Leave room
  socket.on('leave room', ({ room, nickname }) => {
    socket.leave(room);
    console.log(`${nickname} left room: ${room}`);
    io.to(room).emit('system message', `${nickname} left the room.`);
  });

  // Chat message
  socket.on('chat message', ({ room, nickname, message }) => {
    console.log(`[${room}] ${nickname}: ${message}`);
    io.to(room).emit('chat message', { nickname, message });
  });

  // Image message
  socket.on('image message', ({ room, nickname, fileName }) => {
    console.log(`[${room}] ${nickname} is sending an image: ${fileName}`);
    io.to(room).emit('system message', `${nickname} is sending an image: ${fileName}`);
  });

  // Audio message
  socket.on('audio message', ({ room, nickname, fileName }) => {
    console.log(`[${room}] ${nickname} is sending an audio file: ${fileName}`);
    io.to(room).emit('system message', `${nickname} is sending an audio file: ${fileName}`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    if (socket.room && socket.nickname) {
      io.to(socket.room).emit('system message', `${socket.nickname} disconnected.`);
    }
    console.log('User disconnected:', socket.id);
  });
});

http.listen(3000, () => {
  console.log('Listening on port 3000');
});
