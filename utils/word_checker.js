var express = require('express');
var http = require('http');
var app = express();

var Errors = require('../errors/errors');

var WORD_LENGTH = 5;

var JOTTO_WORDS = [
    'agile', 'axiom', 'ankle', 'brown', 'bowel', 'basil',
    'chump', 'colon', 'chasm', 'dummy', 'dunce', 'draft',
    'elope', 'excel', 'enemy', 'filth', 'fluid', 'fully',
    'geese', 'goofy', 'group', 'hippo', 'humid', 'hefty',
    'infer', 'input', 'imply', 'jaunt', 'jewel', 'joule',
    'koala', 'karma', 'khaki', 'login', 'lever', 'logic',
    'mourn', 'music', 'musty', 'nasty', 'niece', 'noose',
    'opium', 'organ', 'ozone', 'penis', 'porch', 'proxy',
    'quart', 'quail', 'quirk', 'rhino', 'remix', 'rogue',
    'slush', 'style', 'swift', 'trump', 'twist', 'tummy',
    'urine', 'upper', 'unite', 'vixen', 'vital', 'venom',
    'worst', 'wrong', 'would', 'yacht', 'yearn', 'yucky'
]

module.exports.getWordLength = function() {
    return WORD_LENGTH;
}

module.exports.setWordIndex = function() {
    app.locals.wordIndex = Math.floor(Math.random()*JOTTO_WORDS.length);
}

module.exports.getCorrectnessOfGuess = function(guess, callback) {
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