var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 10;
var camInterval = 1000 / camFps;

var lowThresh = 0;
var highThresh = 100;
var nIters = 2;
var minArea = 2000;

var BLUE  = [0, 255, 0]; // B, G, R
var RED   = [0, 0, 255]; // B, G, R
var GREEN = [0, 255, 0]; // B, G, R
var WHITE = [255, 255, 255]; // B, G, R

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  setInterval(function() {

    camera.read(function(err, im) {
      if (err) throw err;

      width = im.width()
      height = im.height()
      if (width < 1 || height < 1) throw new Error('Image has no size');

      var out = new cv.Matrix(height, width);
      im.convertGrayscale();
      im_canny = im.copy();
      im_canny.canny(lowThresh, highThresh);
      im_canny.dilate(nIters);

      contours = im_canny.findContours();

      for (i = 0; i < contours.size(); i++) {

        if (contours.area(i) < minArea) continue;

        var arcLength = contours.arcLength(i, true);
        contours.approxPolyDP(i, 0.01 * arcLength, true);

        switch(contours.cornerCount(i)) {
          case 3:
            out.drawContour(contours, i, GREEN);
            break;
          case 4:
            out.drawContour(contours, i, RED);
            break;
          default:
            out.drawContour(contours, i, WHITE);
        }
      }

      socket.emit('frame', { buffer: out.toBuffer() });
    });
  }, camInterval);
};


