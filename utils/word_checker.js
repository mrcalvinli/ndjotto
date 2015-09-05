var express = require('express');
var http = require('http');
var app = express();

var Errors = require('../errors/errors');

var WORD_LENGTH = 5;

var JOTTO_WORDS = [
    'chump'
]

module.exports.getWordLength = function() {
    return WORD_LENGTH;
}

module.exports.setWordIndex = function() {
    app.locals.wordIndex = Math.floor(Math.random()*JOTTO_WORDS.length);
}

module.exports.getCorrectnessOfGuess = function(guess, callback) {
    // var puzzleNum = app.locals.wordIndex;

    // return http.get({
    //     host: 'courses.csail.mit.edu',
    //     path: '/6.005/jotto.py?puzzle=' + puzzleNum + '&guess=' + guess
    // }, function(response) {
    //     var results = '';
    //     response.on('data', function(data) {
    //         results += data;
    //     });

    //     response.on('end', function() {
    //         if (results.indexOf('guess') === 0) {
    //             results = results.replace('\n', '');
    //             var splitResult = results.split(' ');
    //             callback({
    //                 correctLetters: splitResult[1],
    //                 correctPositions: splitResult[2]
    //             });
    //         } else {
    //             callback(undefined, Errors.guess.invalidGuess);
    //         }
    //     })
    // });

    var expectedMap = getLetterToIndexMap(getCorrectWord());
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

module.exports.isCorrectWord = function(guess) {
    return guess === getCorrectWord();
}

//====== Helper Functions =======================================

var getCorrectWord = function() {
    return JOTTO_WORDS[app.locals.wordIndex];
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