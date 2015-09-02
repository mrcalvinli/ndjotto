var ndJottoApp = angular.module('ndJottoApp');

ndJottoApp.controller('guessCtrl', function($scope, $rootScope) {
  var public = $scope.viewModel = {
    guesses: []
  };

  var setViewModel = function() {

  };

  // Private ////////////////////////////////////////////////////////

  var focusedInput_ = undefined;
  var wordLength_ = 7;
  var numGuesses_ = 0;
  var totalGuesses_ = 10;
  var gameOver_ = false;

  var ajax_ = (function() {
    var exports = {};

    exports.getGuessResults = function(guess) {
      return $.ajax({
        url: '/api/guess',
        method: 'POST',
        data: {
          'guess': guess
        }
      });
    };

    exports.postPassword = function(password) {
      return $.ajax({
        url: '/api/login', 
        method: 'POST', 
        data: {
          'password': password
        }
      });
    };

    return exports;
  })();

  var domElements_ = {
    guessInput: "<table><tbody><tr><td>&rsaquo;&nbsp;</td><td width='100%'><input type='text' id='wordGuessInput'></td></tr></tbody></table>"
  };

  var display_ = (function() {
    var exports = {};

    exports.addWordGuessInput = function() {
      if (!gameOver_) {
        eventHandlers.offWordGuessInput();
        $('body').append('<br>');
        $('body').append((totalGuesses_ - numGuesses_) + " attempts remaining");
        $('#wordGuessInput').attr('id', '');
        $('body').append('<br>');
        $('body').append(domElements_.guessInput);
        setFocusedInput_($('#wordGuessInput'));
        eventHandlers.onWordGuessInput();
      }
    };

    exports.showDescription = function() {
      var description = "";
      description += "Welcome to ND Jotto.  You will be attempting to decode the passcode into the mainframe.";

      description += "<br> <br> DO NOT REFRESH THE PAGE";

      description += "<br> <br> You will have " + totalGuesses_ + " login attempts before the system locks you out.";
      description += "<br> However, on each login attempt, the system will give you information about how your input compares with the passcode in terms of: <br>";
      description += "&nbsp; - number of letters your input shares in common with the passcode <br>";
      description += "&nbsp; - number of letters your input has in the same position as the passcode <br>";
      description += "&nbsp;&nbsp; ex: the words 'the' and 'she' both have an 'h' in the second position, and an 'e' in the third position";
      description += "<br> <br> The only information you have about the passcode is that it is " + wordLength_ + " letters long, and that it is an English word.  Make sure your inputs are " + wordLength_ + " letters long."

      description += "<br> <br> Input your guess below: ";

      $('body').append(description);
      exports.addWordGuessInput();
    };

    return exports;
  })();;

  function addGuessToTable_(guess, results) {
    public.guesses.push({
      'guess': guess,
      'correctLetters': results.correctLetters,
      'correctPositions': results.correctPositions
    });
    $scope.$apply();
  };

  function disableFocusedInput_() {
    if (focusedInput_ !== undefined) {
      focusedInput_.prop('disabled', true);
    }
  };

  function setFocusedInput_(input) {
    disableFocusedInput_();
    focusedInput_ = input;
    focusedInput_.focus();
  };

  function incrementGuesses_() {
    numGuesses_++;
    if (numGuesses_ >= totalGuesses_) {
      gameOver_ = true;
      $('body').append('<br> <br>');
      $('body').append('This account has been locked due to excessive login attempts');
      focusedInput_.blur();
      disableFocusedInput_();
      eventHandlers.offWordGuessInput();
    } 
  };

  var init = (function() {
    console.log("I see you're trying to take an alternate approach to finding the passcode.  Feel free to inspect the source code or mess with the console, but it won't offer any extra information that we haven't already given you.");

    setViewModel();

    setFocusedInput_($('#passwordInput'));
  })();

  /**
   * All event related code initialized here
   *
   */
  var eventHandlers = (function() {
    var exports = {};

    // Main
    $(document).on('click', function() {
      focusedInput_.focus();
    });

    $('#passwordInput').on('keyup', function(e) {
      if (e.keyCode == 13) {

        ajax_.postPassword($(this).val()).done(function(data) {
          if (data.isCorrect) {
            $('body').html('');
            display_.showDescription();
          }
        });

        $(this).val("");
      }
    });

    exports.onWordGuessInput = function() {
      $('#wordGuessInput').on('keyup', function(e) {
        if (e.keyCode == 13) {
          var guess = $(this).val();

          ajax_.getGuessResults(guess).done(function(data) {
            incrementGuesses_();

            if (!gameOver_) {
              $('body').append('Number of correct letters: ' +  data.correctLetters);
              $('body').append('<br>');
              $('body').append('Number of letters in correct position: ' + data.correctPositions);
              $('body').append('<br>');
            }

            if (guess.length == data.correctLetters && guess.length == data.correctPositions) {
              gameOver_ = true;
              $('body').html('');
              $('body').append('Access granted, the passcode is: ' + guess);
            } else {
              if (!gameOver_) {
                display_.addWordGuessInput();
              }
            }
          }).fail(function(err) {
            incrementGuesses_();

            if (err.status == 400) {
              if (!gameOver_) {
                $('body').append('ERROR: ' + err.responseJSON.message + '<br>');
                display_.addWordGuessInput();
              }
            }
          });
        }
      });
    };

    exports.offWordGuessInput = function() {
      $('#wordGuessInput').off('keyup');
    };

    return exports;
  })();
});