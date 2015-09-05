var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index.ejs');
});

router.get('/jotto', function(req, res) {
    res.render('jotto');
});

router.get('/minesweeper', function(req, res) {
    res.render('minesweeper');
});

module.exports = router;