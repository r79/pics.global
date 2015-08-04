var express = require('express');
var router = express.Router();

var multer = require('multer');
var fs = require('fs');
var streamifier = require('streamifier');
var imageQueueService = require('../services/imageQueueService');

router.use(multer({inMemory: true}));

/* GET users listing. */
router.post('/', function(req, res, next) {
  var position = imageQueueService.putImageInQueue(req.files.image);
  res.end((position-1).toString());
});

router.get('/current', function(req, res, next) {
  res.set({
    'Pragma-directive': 'no-cache',
    'Cache-directive': 'no-cache',
    'Cache-control': 'no-cache',
    'Pragma': 'no-cache',
    'expires': '0'
  });
  var readStream;
  if(readStream = imageQueueService.getCurrentImageReadStream()) {
      readStream.pipe(res);
  } else {
    res.status(503).end('no images in queue');
  }
});

module.exports = router;
