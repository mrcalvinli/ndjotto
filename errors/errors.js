var errors = {};
var guess = errors.guess = {};

//====== General errors ========================

errors.unauthorized = {
    status: 401,
    name: 'NotAuthorized',
    message: 'You are not authorized to see this classified information'
};

//====== Guess errors ==========================

guess.notWord = {
    status: 400,
    name: 'NotWord',
    message: 'The guess provided is not a word'
}

guess.containsNonLetters = {
    status: 400,
    name: 'ContainsNonLetters',
    message: 'The guess must only contain letters'
}

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

guess.incorrectGuess = {
    status: 400,
    name: 'IncorrectGuess',
    message: 'The guess you provided is not the correct answer'
}

module.exports = errors;