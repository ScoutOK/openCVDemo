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
      if (err) {
        throw err;
      }

      im.cvtColor('CV_BGR2GRAY');
      var bw = im.adaptiveThreshold(255, 0, 0, 15, 2);
      bw.bitwiseNot(bw);

      // var vertical = bw.clone();

      // var verticalsize = vertical.size()[0] / 30;
      // var verticalStructure = cv.imgproc.getStructuringElement(1, [1, verticalsize]);

      // // Apply morphology operations
      // vertical.erode(1, verticalStructure);
      // vertical.dilate(1, verticalStructure);

      // vertical.bitwiseNot(vertical);
      // vertical.gaussianBlur([3, 3]);

      var horizontal = bw.clone();

      var horizontalsize = horizontal.size()[0] / 50;
      var horizontalStructure = cv.imgproc.getStructuringElement(1, [horizontalsize, 1]);

      // Apply morphology operations
      horizontal.erode(1, horizontalStructure);
      horizontal.dilate(1, horizontalStructure);

      horizontal.bitwiseNot(horizontal);
      horizontal.gaussianBlur([3, 3]);

      // Save output image
      socket.emit('frame', { buffer: horizontal.toBuffer() });
    });
  }, camInterval);
};
