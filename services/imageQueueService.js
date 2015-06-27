/**
 * Created by r79 on 6/27/2015.
 */
var fs = require('fs');
var streamifier = require('streamifier');

var putImageInQueue = function(imageObject){
    var outputFileStream = fs.createWriteStream('./hiddenFileUploads/' + imageObject.originalname);
    streamifier.createReadStream(imageObject.buffer).pipe(outputFileStream);
};

exports.putImageInQueue = putImageInQueue;