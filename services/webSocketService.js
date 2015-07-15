var io = require('socket.io')();

var sendNextImage = function () {

};

io.on('connection', function(socket) {
   console.log('A user connected');
});

var sendImageCycle = function () {
   console.log('sending current image');
   io.emit('imageCycle', '');
};

module.exports = {
   sendImageCycle: sendImageCycle,
   io: io
};