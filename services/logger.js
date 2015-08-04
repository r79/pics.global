var dateformat = require('dateformat');

var log = function (string) {
    console.log(dateformat(Date.now(), "d mmm HH:MM:ss") + " - " + string);
};

exports.log = log;