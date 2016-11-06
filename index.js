'use strict'

const express = require('express');
const router = require('./router');
const faceDetect = require('./server/face-detect')
const http = require('http');
const morgan = require('morgan');
const socketio = require('socket.io');




const app = express();
app.set('port', 2222);
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

//requiring socket.io
let server = http.createServer();
server.on('request', app);

server.listen(app.get('port'), function( server ) {
  console.log( 'Listening on port 2222' );
});


app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

//implement socket.io into the server
var io = socketio(server);

io.on('connection', faceDetect);

module.exports.app = app;



