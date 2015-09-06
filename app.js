var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var loginApi = require('./routes/api/login');
var guessApi = require('./routes/api/guess');
var gameStatusApi = require('./routes/api/jotto_game_status');
var minesweeperApi = require('./routes/api/minesweeper');

var GameStatus = require('./utils/jotto_game_status');
var WordChecker = require('./utils/word_checker');

var app = express();

// Set app variables
GameStatus.setGameStatus(false);
WordChecker.setWordIndex();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/login', loginApi);
app.use('/api/guess', guessApi);
app.use('/api/gamestatus', gameStatusApi);
app.use('/api/minesweeper', minesweeperApi);

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

console.log('Running on: ', (process.env.OPENSHIFT_NODEJS_PORT || 8080));
app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
    process.env.OPENSHIFT_NODEJS_IP);

module.exports = app;
