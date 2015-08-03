var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

router.use(cookieParser());

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.cookies.sentDisclaimer) {
    res.redirect('/disclaimer');
  } else {
    res.render('index', { title: 'Pics.global' });
  }
});

router.get('/disclaimer', function (req, res, next) {
  res.cookie('sentDisclaimer', 'true', {path: '/', httpOnly: true});
  res.render('disclaimer');
  res.end();
});

module.exports = router;
