var io = require('socket.io')();
var logger = require('../services/logger.js');
var pjson = require('../package.json');

var usercount = 0;
var currentImageTimestamp = Date.now();

io.on('connection', function(socket) {
   usercount++;

   socket.emit('initialData',{
      version: pjson.version,
      userCount: usercount,
      currentImageTimestamp: currentImageTimestamp
   });

   socket.on('disconnect', function () {
      usercount--;
   });
});

var sendImageCycle = function () {
   currentImageTimestamp = Date.now();
   io.emit('imageCycle', '');
};

var logUsercount = function () {
   logger.log("current usercount: " + usercount);
};
logUsercount();

setInterval(logUsercount, 60000);

module.exports = {
   sendImageCycle: sendImageCycle,
   io: io
};

