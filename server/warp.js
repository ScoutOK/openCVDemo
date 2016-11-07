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

      var width = im.width();
      var height = im.height();

      var srcArray = [0, 0, width, 0, width, height, 0, height];
      var dstArray = [0, 0, width * 0.9, height * 0.1, width, height, width * 0.2, height * 0.8];
      var xfrmMat = im.getPerspectiveTransform(srcArray, dstArray);
      im.warpPerspective(xfrmMat, width, height, [255, 255, 255]);
      socket.emit('frame', { buffer: im.toBuffer() });
    });
  }, camInterval);
};

