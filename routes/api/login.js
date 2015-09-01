var express = require('express');
var router = express.Router();

var PASSWORD = 'youaretrash'

router.post('/', function(req, res) {
    var givenPassword = req.body.password;

    return res.status(200).send({
        isCorrect: givenPassword === PASSWORD
    });
});

module.exports = router;