var Timer = function(seconds, minutes) {
  this.seconds = seconds;
  this.minutes = minutes || 0;
};

Timer.prototype.incrementSeconds = function() {
  this.seconds += 1;
};

Timer.prototype.decrementSeconds = function() {
  if (this.seconds == 0) {
    if (this.minutes > 0) {
      this.seconds = 59;
      this.decrementMinutes();
    }
  } else {
    this.seconds -= 1;
  }
};

Timer.prototype.incrementMinutes = function() {

};

Timer.prototype.decrementMinutes = function() {
  if (this.minutes > 0) {
    this.minutes--;
  }
};

Timer.prototype.getDisplayTime = function() {
  var minutes = this.minutes || Math.floor(this.seconds/60);
  var seconds = this.seconds % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds
};