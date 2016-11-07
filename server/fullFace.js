const cv = require('opencv');

// camera properties
const camWidth = 320;
const camHeight = 240;
const camFps = 10;
const camInterval = 1000 / camFps;

// face detection properties
const frontColor = [255, 0, 0];
const faceThickness = 2;

const eyeColor = [0, 0, 255];
const mouthColor = [0, 255, 0];
const profileColor = [255, 0, 255];
const featThickness = 1;

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  setInterval(function() {

    camera.read(function(err, im) {
      if (err) throw err;


      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt.xml', {}, function(err, faces) {
        if (err) throw err;

        for (var i = 0; i < faces.length; i++) {
          let face = faces[i];
          //console.log(face)
          im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2, frontColor, faceThickness);
          //im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_default.xml')
        }
        socket.emit('frame', { buffer: im.toBuffer() });
      });

      im.detectObject('./node_modules/opencv/data/haarcascade_eye.xml', {}, function(err, eyes) {
        if (err) throw err;

        for (var i = 0; i < eyes.length && i < 2; i++) {
          let eye = eyes[i];
          //console.log(eye)
          im.ellipse(eye.x + eye.width / 2, eye.y + eye.height / 2, eye.width / 2, eye.height / 2, eyeColor, featThickness);
          //im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_default.xml')
        }
        socket.emit('frame', { buffer: im.toBuffer() });
      });


      im.detectObject('./node_modules/opencv/data/haarcascade_mcs_nose.xml', {}, function(err, mouths) {
        if (err) throw err;

        for (var i = 0; i < 1 && i < mouths.length; i++) {
          let mouth = mouths[i];
          //console.log(mouth)
          im.ellipse(mouth.x + mouth.width / 2, mouth.y + mouth.height / 2, mouth.width / 2, mouth.height / 2, mouthColor, featThickness);
          //im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_default.xml')
        }
        socket.emit('frame', { buffer: im.toBuffer() });
      });

      im.detectObject('./node_modules/opencv/data/haarcascade_profileface.xml', {}, function(err, faces) {
        if (err) throw err;

        for (var i = 0; i < faces.length; i++) {
          let face = faces[i];
          //console.log(face)
          im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2, profileColor, faceThickness);
          //im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_default.xml')
        }
        socket.emit('frame', { buffer: im.toBuffer() });
      });
    });
  }, camInterval);
};
