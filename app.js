/* Express */
var express = require('express');
var app = express();

/* Request */
var request = require('request');

/* Credentials */
var credentials = require('./credentials');

var countdown = 0;

setInterval(function() {
  countdown -= 10000;
  if (countdown < 0) countdown = 0;
  request('https://api.spark.io/v1/devices/' + credentials.id + 
          '/detected?access_token=' + credentials.token, function(error, resp, body) {
    if (!error && resp.statusCode == 200) {
      if (JSON.parse(body).result[3] == 1) {
        countdown = 300000;
      }
    }
  });
}, 10000);

app.get('/', function(req, res) {
  if (countdown > 0) {
    res.send("Intruder detected!");
  }
  else res.send("All quiet");
});

app.listen(7000);
