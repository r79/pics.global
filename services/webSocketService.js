var io = require('socket.io')();
var logger = require('../services/logger.js');
var pjson = require('../package.json');

var usercount = 0;

io.on('connection', function(socket) {
   usercount++;

   socket.emit('initialData',{
      version: pjson.version,
      userCount: usercount,
      currentImageInfo: '1234s'
   });

   socket.on('disconnect', function () {
      usercount--;
   });
});

var sendImageCycle = function () {
   io.emit('imageCycle', '');
};

module.exports = {
   sendImageCycle: sendImageCycle,
   io: io
};


var logUsercount = function () {
   logger.log("current usercount: " + usercount);
};
logUsercount();

setInterval(logUsercount, 60000);
