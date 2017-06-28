var express =require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var fs = require('fs');

app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index2.html');
});

io.sockets.on('connection', function(socket) {

    socket.broadcast.emit('newClient', socket.id);
    console.log((new Date()) + ' Connection established.');

    // When a user send a SDP message
    // broadcast to all users in the room
    socket.on('message', function(toId, message) {
        io.to(toId).emit('message', socket.id, message);
    });

    // When the user hangs up
    // broadcast bye signal to all users in the room
    socket.on('disconnect', function() {
        // close user connection
        console.log((new Date()) + " Peer disconnected.");
        socket.broadcast.emit("message",socket.id,{type: "bye"});
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
