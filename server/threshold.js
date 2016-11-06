var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 10;
var camInterval = 1000 / camFps;


// (B)lue, (G)reen, (R)ed
var lower_threshold = [33, 33, 33];
var upper_threshold = [200, 200, 200];

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      im.inRange(lower_threshold, upper_threshold);

      socket.emit('frame', { buffer: im.toBuffer() });
    });
  }, camInterval);
};
