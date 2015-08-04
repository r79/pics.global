//npm modules
var fs = require('fs');
var streamifier = require('streamifier');

//project modules
var imageController = require('../routes/image.js');
var webSocketService = require('../services/webSocketService.js');

//static variables
var UPLOAD_FOLDER = './hiddenFileUploads/';
var BACKUP_FILE_PATH = './backupImageQueue';

//runtime variables
var cycle;
var imageQueue = [];
var currentImage;

//-------------------------------------------

var putImageInQueue = function (imageObject) {
    var imageName = Date.now();
    var outputFileStream = fs.createWriteStream(UPLOAD_FOLDER + imageName);
    streamifier.createReadStream(imageObject.buffer).pipe(outputFileStream);
    var queuelength = imageQueue.push(imageName.toString());
    if(!cycle) {
        nextImage();
    }
    return queuelength;
};

var getCurrentImageReadStream = function () {
    return (currentImage ? fs.createReadStream(UPLOAD_FOLDER + currentImage) : undefined);
};

var nextImage = function () {
    console.log('cycling images...');

    if (imageQueue.length <= 1) {
        console.log('queue is empty, keeping current image');
        cycle = undefined;
    } else {
        fs.unlink(UPLOAD_FOLDER + imageQueue.shift());
        cycle = setTimeout(nextImage, 13370);
    }
    currentImage = imageQueue[0];
    webSocketService.sendImageCycle();
    queueBackup();
};

var queueBackup = function () {
    console.log('created Queue Backup' + JSON.stringify(imageQueue));
    var backupFileStream = fs.createWriteStream(BACKUP_FILE_PATH);
    streamifier.createReadStream(JSON.stringify(imageQueue)).pipe(backupFileStream);
};

//Constructor
(function () {
    if (fs.existsSync(UPLOAD_FOLDER)) {
        if (fs.existsSync(BACKUP_FILE_PATH)) {
            imageQueue = JSON.parse(fs.readFileSync(BACKUP_FILE_PATH));
            console.log('restored previous state');
            var files = fs.readdirSync(UPLOAD_FOLDER);
            files.forEach(function (file) {
                if (imageQueue.indexOf(file) === -1) {
                    fs.unlink(UPLOAD_FOLDER + file);
                }
            });
            console.log('cleaned up');
        }
    } else {
        fs.mkdir(UPLOAD_FOLDER);
    }

    nextImage();
})();

exports.putImageInQueue = putImageInQueue;
exports.getCurrentImageReadStream = getCurrentImageReadStream;