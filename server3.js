var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require("express");

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function(request, response) {
  response.send('Hello World 2!');
});

var privateKey = fs.readFileSync(__dirname + '/ssl/server.key').toString();
var certificate = fs.readFileSync(__dirname + '/ssl/gandiSSL.pem').toString();

var options = {
  key: privateKey,
  cert: certificate
};

https.createServer(options, app).listen(process.env.PORT, function () {
  console.log("Express server listening on port " + app.get('port'));
});
