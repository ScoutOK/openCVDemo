'use strict'

const express = require('express');
const router = require('./router');
const cvMethods = require('./server/contours')
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


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});



//implement socket.io into the server
var io = socketio(server);


io.on('connection', (socket) => {
  console.log('user has connected')
  socket.on('location', function(loc){
    const page = loc.substring(22)
    switch (page) {
      case 'index.html':
        require('./server/fullFace')(socket)
        break
      case 'edges.html':
        require('./server/contours')(socket)
        break
      case 'greyscale.html':
        require('./server/greyscale')(socket)
        break
      case 'hsv.html':
        require('./server/hsv')(socket)
        break
      case 'removeLines.html':
        require('./server/removeLines')(socket)
        break
      case 'threshold.html':
        require('./server/threshold')(socket)
        break
      case 'shapes.html':
        require('./server/detectShapes')(socket)
        break
      default:
        require('./server/fullFace')(socket)
        break
    }
  });
}
      //cvMethods
  );

module.exports.app = app;



