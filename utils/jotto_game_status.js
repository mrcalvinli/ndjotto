var express = require('express');

var app = express();

module.exports.getGameStatus = function() {
    return app.locals.hasWon;
}

module.exports.setGameStatus = function(gameStatus) {
    app.locals.hasWon = gameStatus;
}