var express = require('express');
var router = express.Router();

var PasswordChecker = require('../../utils/password_checker');

router.post('/', function(req, res) {
    var givenPassword = req.body.password;

    return res.status(200).send({
        isCorrect: PasswordChecker.isCorrectPassword(givenPassword)
    });
});

module.exports = router;