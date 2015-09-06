var ndJottoApp = angular.module('ndJottoApp');

ndJottoApp.controller('guessCtrl', function($scope, $rootScope) {
  var public = $scope.viewModel = {
    guesses: []
  };

  var setViewModel = function() {

  };

  // Private ////////////////////////////////////////////////////////

  var focusedInput_ = undefined;
  var wordLength_ = 6;
  var numGuesses_ = 0;
  var totalGuesses_ = Infinity;
  var gameOver_ = false;
  var isTimed_ = true;
  var minutes_ = 10;
  var seconds_ = 0;
  var timer_ = undefined;
  var timerInterval_ = undefined;
  if (minutes_ || seconds_) {
    timer_ = new Timer(seconds_, minutes_);
  }

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

    exports.postGuess = function(guess) {
      return $.ajax({
        url: '/api/gamestatus/won', 
        method: 'POST', 
        data: {
          'guess': guess
        }
      });
    };

    return exports;
  })();

  var domElements_ = {
    guessInput: "<table><tbody><tr><td>&rsaquo;&nbsp;</td><td width='100%'><input type='text' id='wordGuessInput'></td></tr></tbody></table>", 
    spacer: "<br>"
  };

  var display_ = (function() {
    var exports = {};

    exports.showAttempts = function() {
      if (totalGuesses_ != Infinity) {
        $('body').append('<br>');
        $('body').append((totalGuesses_ - numGuesses_) + " attempts remaining");
      }
    };

    exports.addWordGuessInput = function() {
      if (!gameOver_) {
        eventHandlers.offWordGuessInput();
        $('#wordGuessInput').attr('id', '');
        $('body').append('<br>');
        $('body').append(domElements_.guessInput);
        setFocusedInput_($('#wordGuessInput'));
        eventHandlers.onWordGuessInput();
      }
    };

    exports.showDescription = function() {
      var line1Div = $("<div id='line1'></div>");
      var line2Div = $("<div id='line2'></div>");
      $('body').append(line1Div, 
                       domElements_.spacer, 
                       line2Div);

      var line1 = "Hey, ^100 this is Ajax. ^750 Let me know when you're here. ";
      var line2 = "^500 The mainframe can only be accessed from your physical location. ^1000 You’re going to need to guess the password. ^500 The only thing I can tell you now is that it is " + wordLength_ + " letters long, and an English word. ^500 If you guess a correct letter, or one in the correct position I can tell you if it’s correct^100.^100.^100.^500 You have " + minutes_ + " minutes before the system locks you out, ^500 hurry! ^300 <br> ^200 <br> ^100";
      line2 += "Input your guess below: ^800"

      $('#line1').typed({
        strings: [line1], 
        typeSpeed: 1, 
        callback: function() {
          setTimeout(function() {
            $('#line1').append("[Enter]");
          }, 1000);

          var firstEnter = function(e) {
            if (e.keyCode == 13) {
              $("#line2").typed({
                strings: [line2], 
                typeSpeed: 1, 
                callback: function() {
                  exports.showTimer();
                  exports.addWordGuessInput();
                }
              });

              $(document).off('keyup', firstEnter);
            }
          };

          $(document).on('keyup', firstEnter);
        }
      });
    };

    exports.showGuessInfo = function(guess) {
      disableFocusedInput_();
      var correctLettersDiv = $("<div id='correctLetters'></div>");
      var correctPositionsDiv = $("<div id='correctPositions'></div>");
      $('body').append(correctLettersDiv, correctPositionsDiv);
      correctLettersDiv.append('Number of correct letters: ');
      scrollToBottom_();
      setTimeout(function() {
        correctLettersDiv.append(guess.correctLetters);
        setTimeout(function() {
          correctPositionsDiv.append('Number of letters in correct position: ');
          scrollToBottom_();
          setTimeout(function() {
            correctPositionsDiv.append(guess.correctPositions);

            $('#correctLetters').attr('id', '');
            $('#correctPositionsDiv').attr('id', '');
            setTimeout(function() {
              enableFocusedInput_();
              exports.addWordGuessInput();
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    };

    exports.showWinMessage = function(guess) {
      gameOver_ = true;
      stopTimer_();

      $('body').html('');
      var winMessage = $("<div id='winMessage'></div>");
      $('body').append(winMessage);
      $('#winMessage').typed({
        strings: ["We're in. ^500 Sit tight while the other hacker retrieves the bomb schematic."], 
        typeSpeed: 1
      });
      scrollToBottom_();

      ajax_.postGuess(guess);
    };

    exports.showLoseMessage = function() {
      gameOver_ = true;
      stopTimer_();

      deactivateInput_();

      // $('body').html('');
      var loseMessage = $("<div id='loseMessage'><br></div>");
      $('body').append(loseMessage);
      scrollToBottom_();
      $('#loseMessage').typed({
        strings: ["Your position has been compromised. ^500 ABORT MISSION!!!"], 
        typeSpeed: 1
      });
    };

    exports.showTimer = function() {
      if (!$("#timer")[0]) {
        $('body').append("<div id='timer'></div>");
        startTimer_();
      }
      $('#timer').html(timer_.getDisplayTime());
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

  function enableFocusedInput_() {
    if (focusedInput_ !== undefined) {
      focusedInput_.prop('disabled', false);
    }
  };

  function setFocusedInput_(input) {
    disableFocusedInput_();
    focusedInput_ = input;
    focusedInput_.focus();
  };

  function checkGuess_(guess, wordData) {
    gameOver_ = (guess.length == wordData.correctLetters && guess.length == wordData.correctPositions);
    return gameOver_;
  };

  function incrementGuesses_(guess, wordData) {
    numGuesses_++;
    if (numGuesses_ >= totalGuesses_) {
      display_.showLoseMessage();
      
    } else if (guess !== undefined && wordData !== undefined && checkGuess_(guess, wordData)) {
      display_.showWinMessage(guess);
    }
  };

  function scrollToBottom_() {
    window.scrollTo(0, document.body.scrollHeight);
  };

  function startTimer_() {
    if (timer_ !== undefined) {
      timerInterval_ = setInterval(function() {
        timer_.decrementSeconds();
        display_.showTimer();
        if (timer_.minutes == 0 && timer_.seconds == 0) {
          display_.showLoseMessage();
        }
      }, 1000);
    }
  };

  function stopTimer_() {
    clearInterval(timerInterval_);
    $("#timer").remove();
  };

  function deactivateInput_() {
    focusedInput_.blur();
    disableFocusedInput_();
    if (gameOver_) {
      eventHandlers.offWordGuessInput();
    }
  };

  function activateInput_() {
    enableFocusedInput_();
    focusedInput_.focus();
  };

  function sizingJS() {

  };

  function responsiveJS() {
    sizingJS();

    scrollToBottom_();
  };

  var init = (function() {
    console.log("I see you're trying to take an alternate approach to finding the passcode.  Feel free to inspect the source code or mess with the console, but it won't offer any extra information that we haven't already given you.");

    setViewModel();

    setFocusedInput_($('#passwordInput'));

    sizingJS();
    $(window).resize(function() {
      responsiveJS();
    });
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

          ajax_.getGuessResults(guess).done(function(wordData) {
            incrementGuesses_(guess, wordData);

            if (!gameOver_) {
              display_.showGuessInfo(wordData);
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