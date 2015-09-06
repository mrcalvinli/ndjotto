var ndJottoApp = angular.module('ndJottoApp');

ndJottoApp.controller('ndMinesController', function($scope, $rootScope) {
  var public = $scope.viewModel = {

  };

  var setViewModel = function() {

  };

  // Private ////////////////////////////////////////////////////////

  var gameOver_ = false;
  var focusedInput_ = undefined;
  var jottoWon_ = false;
  var minesweeper_ = undefined;
  var binaryBoard_ = undefined;
  var color_ = undefined;

  var ajax_ = (function() {
    var exports = {};

    exports.postPassword = function(password) {
      return $.ajax({
        url: '/api/login', 
        method: 'POST', 
        data: {
          'password': password
        }
      });
    };

    exports.getGameStatus = function() {
      return $.ajax({
        url: "/api/gamestatus", 
        method: "GET"
      });
    };

    exports.postPWforBoard = function(password) {
      return $.ajax({
        url: "/api/minesweeper/board", 
        method: "POST", 
        data: {
          password: password
        }
      });
    };

    exports.postBoard = function(binaryBoard) {
      var board = JSON.stringify(binaryBoard);
      return $.ajax({
        url: "/api/minesweeper/color", 
        method: "POST", 
        data: {
          board: board
        }
      });
    };

    return exports;
  })();

  var domElements_ = {
    input: "<table><tbody><tr><td>&rsaquo;&nbsp;</td><td width='100%'><input type='text' id='consoleInput'></td></tr></tbody></table>",
    spacer: "<br>"
  };

  var display_ = (function() {
    var exports = {};

    exports.showDescription = function() {
      var line1Div = $("<div id='line1'></div>");
      var line2Div = $("<div id='line2'></div>");
      $("body").append(line1Div, 
                       domElements_.spacer, 
                       line2Div);
      exports.showLine1();
    };

    exports.showLine1 = function() {
      var line1 = "Hey, ^100 Ajax here. ^750 This computer can only be unlocked from the mainframe. ^500 Sit tight while the other hacker penetrates the mainframe’s security.";

      $("#line1").typed({
        strings: [line1], 
        typeSpeed: 1, 
        callback: function() {
          checkJotto_();
        }
      });
    };

    exports.showLine2 = function() {
      var line2 = "You’re in. ^750 Go time. ^300 <br> ^200";
      line2 += "Sweep the computer for bomb schematics. ^500 Sweep for bomb coordinates using the following syntax: ^300 <br> ^200 ";
      line2 += "f 1 ^100 1 ^300 <br> ^200";
      line2 += "This designates that you want to flag the square located at the top left corner. ^500 The first character is the action you wish to take. ^500  Use 'f' when you think a square contains a bomb, and 'd' when you want to clear a square where you're sure there is no bomb. ^500 The next two characters designate the x and y coordinates respectively of the square you want to apply your action on. ^750 Good luck. <br> <br> ^500";

      $("#line2").typed({
        strings: [line2], 
        typeSpeed: 1, 
        callback: function() {
          initializeMinesweeper_();
        }
      });
    };

    exports.showInputErrorMessage = function() {
      var errorMessage = "ERROR: Invalid syntax, or coordinates out of range.";
      $('body').append(errorMessage);
      display_.addConsoleInput();
    };

    exports.addConsoleInput = function() {
      if (!gameOver_) {
        eventHandlers.offConsoleInput();
        $('#consoleInput').attr('id', '');
        $('body').append('<br>');
        $('body').append(domElements_.input);
        setFocusedInput_($('#consoleInput'));
        eventHandlers.onConsoleInput();
      }
    };

    exports.displayMineBoard_ = function(strings) {
      var boardStrings = strings || minesweeper_.toString();
      if (typeof boardStrings == "string" && boardStrings == "BOOM!") {
        exports.showLoseMessage();
      } else {
        for (var i = 0; i < boardStrings.length; i++) {
          var rowString = boardStrings[i];
          $('body').append(rowString + " <br>");
        }
        exports.addConsoleInput();
      }
    };

    exports.showWinMessage = function() {
      gameOver_ = true;

      $('body').html('');
      var winMessage = $("<div id='winMessage'></div>");
      $('body').append(winMessage);

      var message = "Fuck yeah! ^500 I’m decrypting the file now. ^500 Hold on for a moment. ^3500 <br> "

      // TODO: api call to get color
      ajax_.postBoard(binaryBoard_).done(function(data) {
        color_ = data.color;

        message += "Done! ^750 Tell them to cut the " + color_ + " wire. ^300 Quick!";
        $('#winMessage').typed({
          strings: [message], 
          typeSpeed: 1
        });
        scrollToBottom_();
      });
    };

    exports.showLoseMessage = function() {
      gameOver_ = true;

      deactivateInput_();

      $('body').html('');
      var loseMessage = $("<div id='loseMessage'><br></div>");
      $('body').append(loseMessage);
      scrollToBottom_();
      $('#loseMessage').typed({
        strings: ["Shit! ^500 You opened the wrong schematics! ^500 The computer is going into lockdown. Guess whoever’s defusing is just going to have to guess..."]
      });
    };

    return exports;
  })();

  function initializeMinesweeper_() {
    minesweeper_ = new Minesweeper(binaryBoard_);
    display_.displayMineBoard_();
  };

  function onJottoComplete_() {
    display_.showLine2();
  };

  function checkJotto_() {
    ajax_.getGameStatus().done(function(data) {

      if (data.hasWon) {
        jottoWon_ = true;
        onJottoComplete_();
      } else {
        setTimeout(checkJotto_, 5000)
      }
    });
  };

  function waitForJotto_() {
    checkJotto_();
  };

  function disableFocusedInput_() {
    if (focusedInput_ !== undefined) {
      focusedInput_.prop('disabled', true);
    }
  };

  function deactivateInput_() {
    focusedInput_.blur();
    disableFocusedInput_();
    eventHandlers.offConsoleInput();
  };

  function setFocusedInput_(input) {
    disableFocusedInput_();
    focusedInput_ = input;
    focusedInput_.focus();
  };

  function checkInput(action, x, y) {
    if (action != 'f' && action != 'd') {
      return false;
    }

    if (typeof x != 'number' || isNaN(x) || x < 0 || x >= minesweeper_.numRows) {
      return false;
    }

    if (typeof y != 'number' || isNaN(y) || y < 0 || y >= minesweeper_.numCols) {
      return false;
    }

    return true;
  };

  function scrollToBottom_() {
    window.scrollTo(0, document.body.scrollHeight);
  };

  function sizingJS_() {

  };

  function responsiveJS_() {
    sizingJS_();

    scrollToBottom_();
  };

  var init = (function() {
    console.log("Ajax again, just looked through the source to see if I could find anything for the bomb schematics.  No luck... Looks like we'll just have to play this out.");

    setViewModel();

    setFocusedInput_($('#passwordInput'));

    sizingJS_();
    $(window).resize(function() {
      responsiveJS_();
    });
  })();

  var eventHandlers = (function() {
    var exports = {};

    $(document).on('click', function() {
      focusedInput_.focus();
    });

    $('#passwordInput').on('keyup', function(e) {
      if (e.keyCode == 13) {

        var pw = $('#passwordInput').val();

        ajax_.postPassword(pw).done(function(data) {
          if (data.isCorrect) {

            ajax_.postPWforBoard(pw).done(function(data) {
              console.log("data: ", data);
              binaryBoard_ = data;
              $('body').html('');
              display_.showDescription();
            });
          }
        });

        $(this).val("");
      }
    });

    exports.onConsoleInput = function() {
      $('#consoleInput').on('keyup', function(e) {
        if (e.keyCode == 13) {
          var guess = $(this).val().split(" ");

          var action = guess[0];
          var x = parseInt(guess[1]) - 1;
          var y = parseInt(guess[2]) - 1;

          if (checkInput(action, x, y)) {
            if (action == 'f') {
              var boardStrings = minesweeper_.flagAction(x, y);
            } else if (action == 'd') {
              var boardStrings = minesweeper_.dig(x, y);
            }

            if (minesweeper_.isBoardWon()) {
              display_.showWinMessage();
            } else {
              display_.displayMineBoard_(boardStrings);
            }
          } else {
            display_.showInputErrorMessage();
          }
        }
      });
    };

    exports.offConsoleInput = function() {
      $('#consoleInput').off('keyup');
    };

    return exports
  })();
});