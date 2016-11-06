'use strict'

const express = require('express');
const router = require('./router');

const http = require('http');
let server = http.createServer();

const app = express();

var morgan = require('morgan');
app.use(morgan('dev'));

//requiring socket.io
var socketio = require('socket.io');

server.on('request', app);

server.listen(2222, function( server ) {
  console.log( 'Listening on port 2222' );
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

//implement socket.io into the server
var io = socketio(server);

io.on('connection', (socket) => {
    /* This function receives the newly connected socket.
       This function will be called for EACH browser that connects to our server. */
    socket.emit('previous', lines);
    console.log('A new client has connected!');
    socket.on('disconnect', () => console.log(':('));
    socket.on('draw', (...data) => {
      let [start, stop, strokeColor] = [...data];

      lines.push({start: start, stop: stop, strokeColor: strokeColor});

      socket.broadcast.emit('others', ...data);
    })
});



