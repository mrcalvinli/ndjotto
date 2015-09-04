var express = require('express');
var app = express();

var JOTTO_WORDS = [
    'airbag', 'advice', 'atrium', 'barely', 'binder', 'brutal',
    'cherry', 'cowboy', 'cactus', 'depict', 'driver', 'during',
    'expose', 'employ', 'escape', 'fathom', 'flower', 'finale',
    'goblin', 'gluten', 'gurgle', 'harass', 'hydrid', 'horror',
    'illest', 'immune', 'inward', 'jagger', 'jingle', 'jungle',
    'kernel', 'kraken', 'knotty', 'locust', 'larynx', 'lounge',
    'mussel', 'maniac', 'magnum', 'nimble', 'needle', 'nobody',
    'orphan', 'oxygen', 'outfit', 'pledge', 'piston', 'proton',
    'quaker', 'queasy', 'quirky', 'render', 'runoff', 'rookie',
    'surfer', 'safari', 'sprout', 'tingle', 'tittle', 'twenty',
    'uptown', 'ultima', 'united', 'vanity', 'voyage', 'viagra',
    'waning', 'wizard', 'wienie', 'yogurt', 'yonder', 'yellow'
]

module.exports.getWordLength = function() {
    return JOTTO_WORDS[0].length;
}

module.exports.setWordIndex = function() {
    app.locals.wordIndex = Math.floor(Math.random()*(JOTTO_WORDS.length));
}

module.exports.getCorrectnessOfGuess = function(guess) {
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