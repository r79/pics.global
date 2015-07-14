/**
 * Created by r79 on 6/27/2015.
 */
var fs = require('fs');
var streamifier = require('streamifier');

var imageQueue = [];
var backupFileWriteStream;

//Constructor
(function() {
    if(fs.exists("./backupImageQueue")){
        imageQueue = JSON.parse(fs.readFileSync('./backupImageQueue'));
    } else {
        backupFileWriteStream = fs.createWriteStream('./backupImageQueue');
    }
})();

var putImageInQueue = function(imageObject){
    var outputFileStream = fs.createWriteStream('./hiddenFileUploads/' + imageObject.originalname);
    streamifier.createReadStream(imageObject.buffer).pipe(outputFileStream);
    imageQueue.push({
        name: imageObject.originalname,
        extension: imageObject.extension
    });
};

//queueInterval
setInterval(function () {
    console.log('new image interval');
    var currentImage = imageQueue.shift();
    if(!currentImage) {
        console.log('queue is empty!');
        return;
    }
    var readStream = fs.createReadStream('./hiddenFileUploads/' + currentImage.name);
    var writeStream = fs.createWriteStream('./ressources/currentImage.' + currentImage.extension);
    readStream.pipe(writeStream);
}, 13370);


setInterval(function() {
    console.log('created Queue Backup');
    streamifier.createReadStream(JSON.stringify(imageQueue)).pipe(backupFileWriteStream);
}, 60000);

exports.putImageInQueue = putImageInQueue;