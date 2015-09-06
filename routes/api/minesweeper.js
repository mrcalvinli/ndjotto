var express = require('express');
var router = express.Router();

var Errors = require('../../errors/errors');

var app = express();

//Constants
var numExpectedBombs = 10;
var numRows = 8;
var numCols = 8;

var board;

var PasswordChecker = require('../../utils/password_checker');

router.post('/board', function(req, res) {
    var password = req.body.password;

    if (PasswordChecker.isCorrectPassword(password)) {
        board = generateRandomBoard();

        res.status(200).send(board);
    } else {
        var err = Errors.unauthorized;
        res.status(err.status).send(err);
    }
});

router.post('/color', function(req, res) {
    var solvedBoard = req.body.board;

    if (!solvedBoard) { //|| solvedBoard.length !== numRows || solvedBoard[0].length !== numCols) {
        var err = Errors.minesweeper.invalidBoard;
        return res.status(err.status).send(err);
    }

    //Parse board into JSON
    var boardJSON = JSON.parse(solvedBoard);

    if (boardJSON.length !== numRows || boardJSON[0].length !== numCols) {
        var err = Errors.minesweeper.invalidBoard;
        return res.status(err.status).send(err);
    }

    //Loop through and check number of bombs marked correctly
    var numCorrect = 0;
    for (var row = 0; row < numRows; row++) {
        for (var col = 0; col < numCols; col++) {
            if (boardJSON[row][col] === 1 && board[row][col] === 1) {
                numCorrect++;
            }
        }
    }

    if (numCorrect > 0.60*numExpectedBombs) {
        res.status(200).send({color: 'color'});
    } else {
        var err = Errors.minesweeper.invalidBoard;
        res.status(err.status).send(err);
    }
});

var generateRandomBoard = function() {
    var bombProbability = numExpectedBombs/(numCols * numRows);

    var board = [];

    // Loop through and create each square
    for (var row = 0; row < numRows; row++) {
        var boardRow = [];
        for (var col = 0; col < numCols; col++) {
            var isBomb = Math.random() < bombProbability;
            boardRow.push(isBomb? 1 : 0);
        }

        //Add to board
        board.push(boardRow);
    }

    return board;
}

module.exports = router;