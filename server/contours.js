var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 10;
var camInterval = 1000 / camFps;

var lowThresh = 0;
var highThresh = 100;
var nIters = 2;
var maxArea = 2500;

var GREEN = [0, 255, 0]; // B, G, R
var WHITE = [255, 255, 255]; // B, G, R
var RED   = [0, 0, 255]; // B, G, R

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

      var big = new cv.Matrix(height, width);
      var all = new cv.Matrix(height, width);

      im.convertGrayscale();
      im_canny = im.copy();

      im_canny.canny(lowThresh, highThresh);
      im_canny.dilate(nIters);

      contours = im_canny.findContours();
      const lineType = 8;
      const maxLevel = 0;
      const thickness = 1;

      for(i = 0; i < contours.size(); i++) {
        if(contours.area(i) > maxArea) {
          var moments = contours.moments(i);
          var cgx = Math.round(moments.m10 / moments.m00);
          var cgy = Math.round(moments.m01 / moments.m00);
          big.drawContour(contours, i, GREEN, thickness, lineType, maxLevel, [0, 0]);
          big.line([cgx - 5, cgy], [cgx + 5, cgy], RED);
          big.line([cgx, cgy - 5], [cgx, cgy + 5], RED);
        }
      }

      all.drawAllContours(contours, WHITE);

      socket.emit('frame', { buffer: all.toBuffer() });
      });
  }, camInterval);
};
