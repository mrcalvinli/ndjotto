var express = require('express');
var router = express.Router();

var Errors = require('../../errors/errors');
var PasswordChecker = require('../../utils/password_checker');
var GameStatusHelper = require('../../utils/game_status');
var WordChecker = require('../../utils/word_checker');

router.get('/', function(req, res) {
    var hasWon = GameStatusHelper.getGameStatus();
    res.status(200).send({ hasWon: hasWon });
});

router.post('/reset', function(req, res) {
    var password = req.body.password;

    if (PasswordChecker.isCorrectPassword(password)) {
        GameStatusHelper.setGameStatus(false);
        WordChecker.setWordIndex();
        res.status(200).send({});
    } else {
        var err = Errors.unauthorized;
        res.status(err.status).send(err);
    }
});

router.post('/won', function(req, res) {
    var guess = req.body.guess;

    if (WordChecker.isCorrectWord(guess)) {
        GameStatusHelper.setGameStatus(true);
        res.status(200).send({});
    } else {
        var err = Errors.guess.incorrectGuess;
        res.status(err.status).send(err);
    }
});

module.exports = router;