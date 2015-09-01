var express = require('express');
var router = express.Router();

var Errors = require('../../errors/errors');

var JOTTO_WORD = "nudelta";


/**
 * Validate the guess before sending it through middleware
 */
var validateGuess = function(req, res, next) {
    var guess = req.body.guess;

    if (!guess) {
        var err = Errors.guess.noInput;
        res.status(err.status).send(err);
    } else if (guess.length !== JOTTO_WORD.length) {
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

    return res.status(200).send(getCorrectnessOfGuess(guess));
});

var getCorrectnessOfGuess = function(guess) {
    var expectedMap = getLetterToIndexMap(JOTTO_WORD);
    var guessedMap = getLetterToIndexMap(guess);

    var numCorrectLetters = 0;
    var numInCorrectPosition = 0;
    for (var guessedChar in guessedMap) {
        if (expectedMap[guessedChar]) {
            var expectedCharIndexList = expectedMap[guessedChar];
            var guessedCharIndexList = guessedMap[guessedChar];

            // Increment correct number of letters
            numCorrectLetters += Math.min(guessedCharIndexList.length, expectedCharIndexList.length);

            // Check correct placement
            for (var index = 0; index < guessedCharIndexList.length; index++) {
                var guessedCharIndex = guessedCharIndexList[index];
                if (expectedCharIndexList.indexOf(guessedCharIndex) > -1) {
                    numInCorrectPosition += 1;
                }
            }
        }
    }

    return {
        'correctLetters': numCorrectLetters,
        'correctPositions': numInCorrectPosition
    }
}

var getLetterToIndexMap = function(word) {
    // Map word to dictionary
    var letterToIndexMap = {};
    for (var charIndex = 0; charIndex < word.length; charIndex++) {
        var character = word[charIndex];

        // Create empty list if character is not in dictionary
        if (!letterToIndexMap[character]) {
            letterToIndexMap[character] = []
        }

        // Add index of char into dictionary
        letterToIndexMap[character].push(charIndex);
    }

    return letterToIndexMap;
}

module.exports = router;