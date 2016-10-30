var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var reqall = require('require-all');
var app = express();

reqall({
    dirname: __dirname + '/models',
    recursive: true
});
mongoose.connect('mongodb://public:public1@ds031257.mlab.com:31257/kaidb');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', objectToArray(reqall({
    dirname: __dirname + '/routes',
    recursive: true
})));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

/*function getMiddleWare(folders) {
    var middleWareArray = [];

    folders.forEach(function(folder) {
        var files = fs.readdirSync(path.join(__dirname, folder));

        files.forEach(function(file) {
            var filepath = path.join(__dirname, folder, file);
            if (fs.statSync(filepath).isDirectory()) {
                middleWareArray.concat(getMiddleWare([path.join(folder, file)]));
            } else {
                console.log(filepath);
                middleWareArray.push(require(filepath));
            }
        });
    });

    return middleWareArray;
}
*/

function objectToArray(obj) {
    var result = [];

    for (var key in obj) {
        if (typeof obj[key] === 'object') {
            console.log('entered');
            var resArr = objectToArray(obj[key]);
            resArr.forEach(function(item) {
                result.push(item);
            });
        } else {
            result.push(obj[key]);
        }
    }
    return result;
}
