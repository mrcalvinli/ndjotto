var express = require('express');
var router = express.Router();

var WordChecker = require('../../utils/word_checker');
var Errors = require('../../errors/errors');

/**
 * Validate the guess before sending it through middleware
 */
var validateGuess = function(req, res, next) {
    var guess = req.body.guess;

    if (!guess) {
        var err = Errors.guess.noInput;
        res.status(err.status).send(err);
    } else if (guess.length !== WordChecker.getWordLength()) {
        var err = Errors.guess.invalidLength;
        res.status(err.status).send(err);
    } else {
        next();
    }
}

router.post('/', validateGuess, function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    
    // Get guess
    var guess = req.body.guess.toLowerCase();

    return res.status(200).send(WordChecker.getCorrectnessOfGuess(guess));
});

module.exports = router;