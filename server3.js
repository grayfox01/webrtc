var express =require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var fs = require('fs');
var broadcaster=null;

http.listen(5000);

app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.sockets.on('connection', function(socket) {

    if(broadcaster==null){
      broadcaster=socket.id;
      socket.broadcast.emit("broadcastJoin",socket.id);
    }else{
      io.to(broadcaster).emit('clientJoin', socket.id);
    }

    console.log((new Date()) + ' Connection established.');


    socket.on('message', function(toId, message) {
        io.to(toId).emit('message', socket.id, message);
    });

    socket.on('disconnect', function() {
      if(socket.id==broadcaster){
        broadcaster=null;
        socket.broadcast.emit("broadcastLeft",socket.id);
        console.log((new Date()) + "broadcaster disconnected.");
      }else{
        socket.broadcast.emit("clientLeft",socket.id);
        console.log((new Date()) + "client disconnected.");
      }


    });

});
