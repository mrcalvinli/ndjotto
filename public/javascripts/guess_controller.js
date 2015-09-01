var ndJottoApp = ndJottoApp || angular.module('ndJottoApp', []);

ndJottoApp.controller('guessCtrl', function($scope, $rootScope) {
    var public = $scope.viewModel = {
        guesses: []
    };

    var setViewModel = function() {

    };

    // Private ////////////////////////////////////////////////////////

    var ajax = (function() {
        var exports = {};

        exports.getGuessResults = function(guess) {
            $.ajax({
                url: '/api/guess',
                method: 'POST',
                data: {
                    'guess': guess
                },
                success: function(results) {
                    //Reset text in box
                    $('#guessInput').val('');

                    addGuessToTable(guess, results);
                }, 
                error: function(err) {
                    console.error(err);
                }
            });
        }

        return exports;
    })();

    var init = (function() {
        setViewModel();

        eventHandlers();
    })();

    /**
    * All event related code initialized here
    *
    */
    function eventHandlers() {
        $('#wordGuessForm').on('submit', function(e) {
            e.preventDefault();

            var guess = $('#guessInput').val();
            ajax.getGuessResults(guess);
        });
    }

    function addGuessToTable(guess, results) {
        public.guesses.push({
            'guess': guess,
            'correctLetters': results.correctLetters,
            'correctPositions': results.correctPositions
        });
        $scope.$apply();
    }
});