/** @constructor */
var BeepMaker = function () {
  var audioContext = window.AudioContext || window.webkitAudioContext;
  this.context = new audioContext();
  this.muted = false;
};

BeepMaker.prototype.beep = function(frequency, frequency2, type, durationSeconds) {
  if (this.muted) {
    return;
  }
  var ctx = this.context;
  var osc = ctx.createOscillator();
  var gainOsc = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(frequency2, ctx.currentTime + durationSeconds/2);
  osc.frequency.exponentialRampToValueAtTime(frequency, ctx.currentTime + durationSeconds);

  gainOsc.gain.setValueAtTime(1, ctx.currentTime);
  gainOsc.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

  osc.connect(gainOsc);
  gainOsc.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationSeconds);
};

BeepMaker.prototype.toggleMute = function() {
  this.muted = !this.muted;
  return this.muted;
};

BeepMaker.prototype.mute = function() {
  this.muted = true;
};

BeepMaker.prototype.unmute = function() {
  this.muted = false;
};

