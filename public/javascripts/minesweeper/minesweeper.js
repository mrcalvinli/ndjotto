var Minesweeper = function() {
  var exports = {};

  /**
   * Square board represented by list of lists
   */
  var squareBoard = [];

  var numExpectedBombs = 40;

  //Size of board
  var numCols = 16;
  var numRows = 16;

  //Checks whether a dig has been made yet
  var hasDug = false;

  /**
   * Generates the board representation of minesweeper
   *
   * @param inputBoard, board represented as lists of list, 0 denoting not a 
   *        bomb, 1 denoting bomb
   */
  var createRandomBoard = function() {
    var bombProbability = numExpectedBombs/(numCols * numRows);

    // Loop through and create each square
    for (var row = 0; row < numRows; row++) {
      var squareBoardRow = [];
      for (var col = 0; col < numCols; col++) {
        var isBomb = Math.random() < bombProbability;
        squareBoardRow.push(Square(isBomb));
      }

      //Add to board
      squareBoard.push(squareBoardRow);
    }
  }

  var init = (function() {
    createRandomBoard();
  })();

  //====== Helper functions ============================

  /**
   * Counts the number of bombs that are surrounding the square
   * given the coordinate input. i and j must be coordinates that
   * can exist in the board
   * 
   * @param i referring to the x value (column)
   * @param j referring to the y value (row) 
   * @return Number of bombs
   */
  var getBombCount = function(i, j) {
    var count = 0;
    for (var dx = -1; dx < 2; dx++) {
      for (var dy = -1; dy < 2; dy++) {
        //Make sure it's not counting itself (dx=dy=0 and the coordinates are on the board)
        if ((dx != 0 || dy != 0) && i+dx >= 0 && i+dx < numCols && j+dy >= 0 && j+dy < numRows) {
          var square = squareBoard[j+dy][i+dx];
          if (square.isBomb) {
            count++;
          }
        }
      }
    }

    return count;
  }

  //====== Instance methods =============================

  /**
   * Prints out the board in string form.
   * 
   * String formatting rules: <br>
   * (1) "-" Refers to untouched squares <br>
   * (2) "F" Refers to flagged squares <br>
   * (3) " " Refers to touched squares not surrounded by bombs <br>
   * (4) [1-8] Refers to touched squares with # bombs surrounding it <br>
   * (5) Everything is separated by a space
   * 
   * @return a list of strings, where each string is a row (ordered from 
   *         first row ot last)
   */
  exports.toString = function() {
    var boardStrings = [];

    for (var row = 0; row < numRows; row++) {
      var boardRowString = '';
      for (var col = 0; col < numCols; col++) {
        var square = squareBoard[row][col];
        var squareRep = '';

        if (square.flagged) {
          squareRep = 'F';
        } else if (!square.touched) {
          squareRep = '-';
        } else {
          var numBombs = getBombCount(col, row);
          if (numBombs === 0) {
            squareRep = '.';
          } else {
            squareRep = numBombs;
          }
        }

        // Concat with return string
        boardRowString += squareRep;
        if (col != numCols - 1) {
          boardRowString += ' ';
        }
      }

      boardStrings.push(boardRowString);
    }

    return boardStrings;
  }

  /**
   * If the square is on the board and is untouched, the square will 
   * be flag/unflag depending on the input 
   * 
   * @param flag true if flagging, false if unflagging
   * @param i referring to the x value (column)
   * @param j referring to the y value (row)
   * @return String rep of the board
   */
  exports.flagAction = function(flag, i, j) {
    //Only modify if coordinates are on board
    if (i >= 0 && i < numCols && j >= 0 && j < numRows) {
      var square = squareBoard[j][i];

      //Only change flagged if different from input flag and untouched
      if (square.flagged !== flag && !square.touched) {
        square.flagged = flag;
      }
    }

    return exports.toString();
  }

  /**
   * If the square is on the board and is untouched, it will
   * dig the square up. The following will happen:<p>
   * 
   * (1) If it digs up a bomb, it will make the square not a
   * bomb and return the message "BOOM!\r\n" <br>
   * 
   * (2) If there are no bombs surrounding, it
   * will recursively dig the neighbors unless they either 
   * have neighboring bombs or it has been dug already
   * 
   * @param i referring to the x value (column)
   * @param j referring to the y value (row)
   * @return String boom message or board string
   */
  exports.dig = function(i, j) {
    var returnString;

    //Clear all bombs that are around this square
    if (!hasDug) {
      for (var dx = -1; dx < 2; dx++) {
        for (var dy = -1; dy < 2; dy++) {
          var new_x = i + dx;
          var new_y = j + dy;

          if (new_x >= 0 && new_x < numCols && new_y >= 0 && new_y < numRows) {
            var square = squareBoard[new_y][new_x];
            square.isBomb = false;
          }
        }
      }

      hasDug = true;
    }

    //Must be inside board
    if (i >= 0 && i < numCols && j >= 0 && j < numRows) {
      var square = squareBoard[j][i];

      //Only true if square was initially untouched and not flagged
      var digPerformed = false;

      if (!square.touched && !square.flagged) {
        //Need to check neighbors to update board string
        digPerformed = true;

        //Update square variables
        square.touched = true;
        square.flagged = false;

        //It's a bomb!
        if (square.isBomb) {
          returnString = "BOOM!";
        }
      }

      //Check if need to check neighbors and there are no neighboring bombs
      if (digPerformed && getBombCount(i, j) == 0) {
        for (var dx = -1; dx < 2; dx++) {
          for (var dy = -1; dy < 2; dy++) {
            exports.dig(i + dx, j + dy);
          }
        }
      }
    }

    return returnString || exports.toString();
  }

  return exports;
}

// mines = Minesweeper();

// var printList = function(list) {
//   for (var index = 0; index < list.length; index++) {
//     console.log(list[index]);
//   }
// }