var Square = function(isBomb) {
  var exports = {}

  exports.isBomb = isBomb;
  exports.flagged = false;
  exports.touched = false;

  return exports;
}