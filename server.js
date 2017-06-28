var express =require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var fs = require('fs');

app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
  console.log((new Date()) + ' Connection established.');
      // When a user send a SDP message
      // broadcast to all users in the room
      socket.on('message', function(message) {
          console.log((new Date()) + ' Received Message, broadcasting: ' + message);
          socket.broadcast.emit('message', message);
      });
      // When the user hangs up
      // broadcast bye signal to all users in the room
      socket.on('disconnect', function() {
          // close user connection
          console.log((new Date()) + " Peer disconnected.");
          socket.broadcast.emit('user disconnected');
      });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
