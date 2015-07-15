var fs = require('fs');
var streamifier = require('streamifier');

var imageQueue = [];
var imageController = require('../routes/image.js');
var webSocketService = require('../services/webSocketService.js');
var nextImageInterval;

var currentImage;

var UPLOAD_FOLDER = './hiddenFileUploads/';
var BACKUP_FILE_PATH = './backupImageQueue';


var putImageInQueue = function(imageObject){
    var imageName = Date.now();
    var outputFileStream = fs.createWriteStream(UPLOAD_FOLDER + imageName);
    streamifier.createReadStream(imageObject.buffer).pipe(outputFileStream);
    imageQueue.push(imageName);
    if(!nextImageInterval) {
        nextImage();
        nextImageInterval = setInterval(nextImage, 13370);
    }
};

var getCurrentImageReadStream = function () {
    return (currentImage ? fs.createReadStream(UPLOAD_FOLDER + currentImage) : undefined);
};

var nextImage = function () {
    queueBackup();
    console.log('new image interval');
    var topOfQueue = imageQueue.shift();
    if(!topOfQueue) {
        console.log('queue is empty!');
        clearInterval(nextImageInterval);
        nextImageInterval = undefined;
        currentImage = undefined;
        return;
    }
    if(currentImage) {
        fs.unlink(UPLOAD_FOLDER + currentImage);
    }
    currentImage = topOfQueue;
    webSocketService.sendImageCycle();
};

var queueBackup = function() {
    console.log('created Queue Backup' + JSON.stringify(imageQueue));
    var backupFileStream = fs.createWriteStream(BACKUP_FILE_PATH);
    streamifier.createReadStream(JSON.stringify(imageQueue)).pipe(backupFileStream);
};


//Constructor
(function() {
    if(fs.existsSync(BACKUP_FILE_PATH)){
        imageQueue = JSON.parse(fs.readFileSync(BACKUP_FILE_PATH));
        console.log('restored previous state');
        var files =fs.readdirSync(UPLOAD_FOLDER);
        files.forEach(function (file) {
            if(imageQueue.indexOf(file)===-1){
                fs.unlink(UPLOAD_FOLDER + file);
            }
        });
        console.log('cleaned up');
        nextImageInterval = setInterval(nextImage, 13370);
        nextImage();
    }
})();

exports.putImageInQueue = putImageInQueue;
exports.getCurrentImageReadStream = getCurrentImageReadStream;