'use strict';

const socket = io('http://localhost:3000');

// DOM elements
const form = document.getElementById('chatForm');
const messageInput = document.getElementById('m');
const messagesList = document.getElementById('messages');
const nicknameInput = document.getElementById('nickname');
const roomSelect = document.getElementById('room');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const sendImageBtn = document.getElementById('sendImageBtn');
const imageInput = document.getElementById('imageInput');
const sendAudioBtn = document.getElementById('sendAudioBtn');
const audioInput = document.getElementById('audioInput');

let currentRoom = 'general'; // default room
let nickname = 'Anonymous';

// Join room when button clicked
joinRoomBtn.addEventListener('click', () => {
  nickname = nicknameInput.value.trim() || 'Anonymous';
  currentRoom = roomSelect.value;
  socket.emit('join room', { room: currentRoom, nickname });
  messagesList.innerHTML = ''; // clear chat history when switching rooms
});

// Send message
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const msg = messageInput.value.trim();
  if (!msg) return;
  socket.emit('chat message', {
    room: currentRoom,
    nickname,
    message: msg,
  });
  messageInput.value = '';
});

// Receive message
socket.on('chat message', (data) => {
  const item = document.createElement('li');
  item.innerHTML = `<strong>${data.nickname}</strong> says: ${data.message}`;
  messagesList.appendChild(item);
});

// System messages (join/leave notifications)
socket.on('system message', (msg) => {
  const item = document.createElement('li');
  item.style.fontStyle = 'italic';
  item.innerText = msg;
  messagesList.appendChild(item);
});

// trigger hidden file input for image upload
sendImageBtn.addEventListener('click', () => {
  imageInput.click();
});

//show placehodler when image selected

imageInput.addEventListener('change', () => {
  if (imageInput.files.length > 0) {
    const fileName = imageInput.files[0].name;

    //upload UI
    const item = document.createElement('li');
    item.innerHTML = `<strong>${nickname}</strong> is sending an image: [${fileName}]`;
    messagesList.appendChild(item);

    //Emit event to server
    socket.emit('image message', {
        room: currentRoom,
        nickname,
        fileName
    });
    imageInput.value = ''; // reset
  }
});    

// trigger hidden file input for audio upload
sendAudioBtn.addEventListener('click', () => {
  audioInput.click();
});

// Show placeholder when audio selected
audioInput.addEventListener('change', () => {
  if (audioInput.files.length > 0) {
    const fileName = audioInput.files[0].name;

    //upload UI

    const item = document.createElement('li');
    item.innerHTML = `<strong>${nickname}</strong> is sending an audio file: [${fileName}]`;
    messagesList.appendChild(item);

    // Emit event to server
    socket.emit('audio message', {
        room: currentRoom,
        nickname,
        fileName
    });

    audioInput.value = ''; // reset
  }
});