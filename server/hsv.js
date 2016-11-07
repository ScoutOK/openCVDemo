var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 10;
var camInterval = 1000 / camFps;


// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      let img_hsv = im.copy();
      img_hsv.convertHSVscale()

      socket.emit('frame', { buffer: img_hsv.toBuffer() });
    });
  }, camInterval);
};
