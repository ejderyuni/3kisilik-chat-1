const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const ALLOWED_USERS = ['Buğra', 'Hilal', 'Yunus'];
const SHARED_PASSWORD = '808080';

// public klasörünü statik olarak sun
app.use(express.static(path.join(__dirname, 'public')));

// tüm GET / isteklerini index.html'e yönlendir
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('login', ({ username, password }) => {
    if (!ALLOWED_USERS.includes(username)) return socket.emit('login-result', { success: false, message: 'Kullanıcı yetkili değil.' });
    if (password !== SHARED_PASSWORD) return socket.emit('login-result', { success: false, message: 'Şifre yanlış.' });
    socket.data.username = username;
    socket.join('room');
    socket.emit('login-result', { success: true, username });
    io.to('room').emit('system-message', `${username} sohbete katıldı.`);
  });

  socket.on('send-message', (msg) => {
    const username = socket.data.username;
    if (!username) return;
    io.to('room').emit('chat-message', { username, text: msg, time: Date.now() });
  });

  socket.on('disconnect', () => {
    if (socket.data.username) io.to('room').emit('system-message', `${socket.data.username} ayrıldı.`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server listening on', PORT));
