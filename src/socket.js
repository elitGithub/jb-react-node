import socket from 'socket.io';

const server = new socket.Server(4200);

server.on('connection', socket => {
    socket.on('new-user', name => {
        socket.broadcast.emit('user-connected', name);
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message, name: users[socket.id] });
    });
});