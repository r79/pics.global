/**
 * Created by r79 on 6/27/2015.
 */
var fs = require('fs');
var streamifier = require('streamifier');

var imageQueue = [];
var imageController = require('../routes/image.js');
var webSocketService = require('./webSocketService.js');
var currentImage;

var UPLOAD_FOLDER = './hiddenFileUploads/';
var BACKUP_FILE_PATH = './backupImageQueue';


var putImageInQueue = function(imageObject){
    console.log('added Image: ' + imageObject.originalName);
    var outputFileStream = fs.createWriteStream(UPLOAD_FOLDER + imageObject.originalname);
    streamifier.createReadStream(imageObject.buffer).pipe(outputFileStream);
    imageQueue.push({
        name: imageObject.originalname
    });
    console.log('added Image: ' + imageObject.originalName);
};

var getCurrentImageReadStream = function () {
    return fs.createReadStream(UPLOAD_FOLDER + currentImage.name);
};

var nextImage = function () {
    console.log('new image interval');
    var topOfQueue = imageQueue.shift();
    if(!topOfQueue) {
        console.log('queue is empty!');
        return;
    }
    if(currentImage) {
        fs.unlink(UPLOAD_FOLDER + currentImage.name);
    }
    currentImage = topOfQueue;
    queueBackup();
};

var queueBackup = function() {
    console.log('created Queue Backup');
    var backupFileStream = fs.createWriteStream(BACKUP_FILE_PATH);
    streamifier.createReadStream(JSON.stringify(imageQueue)).pipe(backupFileStream);
};


//Constructor
(function() {
    if(fs.existsSync(BACKUP_FILE_PATH)){
        imageQueue = JSON.parse(fs.readFileSync(BACKUP_FILE_PATH));
        console.log('restored previous state');
        nextImage();
    }
})();

setInterval(nextImage, 13370);

exports.putImageInQueue = putImageInQueue;
exports.getCurrentImageReadStream = getCurrentImageReadStream;