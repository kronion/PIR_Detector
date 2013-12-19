/* Express */
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

/* Request */
var request = require('request');

/* Credentials */
var credentials = require('./credentials');

/* Socket.io */
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var countdown = 0;
var update = false;

setInterval(function() {
  countdown -= 3000;
  if (countdown <= 0) {
    countdown = 0;
    request('https://api.spark.io/v1/devices/' + credentials.id + 
            '/detected?access_token=' + credentials.token, function(error, resp, body) {
      // Add logic here
      if (!error && resp.statusCode == 200) {
        if (JSON.parse(body).result[3] == 1) {
          countdown = 10000;
          io.sockets.emit('response', { data: 'Intruder detected!'});
          update = true;
        }
        else if (update) {
          io.sockets.emit('response', { data: 'All quiet'});
          update = false;
        }
      }
    });
  }
}, 3000);

io.sockets.on('connection', function(socket) {
  if (countdown > 0) {
    socket.emit('response', { data: 'Intruder detected!'});
  }
  else socket.emit('response', { data: 'All quiet'});
});

server.listen(7000);
