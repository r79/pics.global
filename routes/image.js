var express = require('express');
var router = express.Router();

var multer = require('multer');
var fs = require('fs');
var streamifier = require('streamifier');
var imageQueueService = require('../services/imageQueueService');

router.use(multer({inMemory: true}));

/* GET users listing. */
router.post('/', function(req, res, next) {
  imageQueueService.putImageInQueue(req.files.image);
  res.end("file uploaded");
});

router.get('/current', function(req, res, next) {
  imageQueueService.getCurrentImageReadStream().pipe(res);
});

module.exports = router;
