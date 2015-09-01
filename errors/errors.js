var errors = {};
var guess = errors.guess = {};

guess.noInput = {
    status: 400,
    name: 'NoInput',
    message: 'A guess must be provided'
}

guess.invalidLength = {
    status: 400,
    name: 'InvalidLength',
    message: 'The guess must be the correct length'
};

module.exports = errors;