'use strict'

const express = require('express');
const router = require('./router');

const http = require('http');
let server = http.createServer();

const app = express();

//requiring socket.io
var socketio = require('socket.io');

server.on('request', app);

app.use(express.static(__dirname + '/public'));

app.use('/', (req, res) => );

app.listen(2222, function( server ) {
  console.log( 'Listening on port 2222' );
});

