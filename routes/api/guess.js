var express = require('express');
var fs = require('fs');
var router = express.Router();

var app = express();

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
    } else if (!(/^[a-zA-Z]+$/.test(guess))) {
        var err = Errors.guess.containsNonLetters;
        res.status(err.status).send(err);
    } else if (!(possibleWords[guess.toLowerCase()]))  {
        var err = Errors.guess.notWord;
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

// Getting all 5 letter words

var possibleWords = {};

function readLines(input, func) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    var last  = 0;
    while (index > -1) {
      var line = remaining.substring(last, index);
      last = index + 1;
      func(line);
      index = remaining.indexOf('\n', last);
    }

    remaining = remaining.substring(last);
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
      console.log('Done writing to dictionary of 5 letter words, size is ' + Object.keys(possibleWords).length);
    }
  });
}

function writeWordsToMap(line) {
  var words = line.split(' ');
  for (var i = 0; i < words.length; i++) {
    var word = words[i].toLowerCase();
    possibleWords[word] = true;
  }
}

//Create dictionary
(function() {
    console.log('Reading dictionary of all 5 letter words');
    var input = fs.createReadStream('words.txt');
    readLines(input, writeWordsToMap);
})();

module.exports = router;