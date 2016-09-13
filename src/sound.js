/** @constructor */
var BeepMaker = function () {
  var audioContext = window.AudioContext || window.webkitAudioContext;
  this.context = new audioContext();
  this.muted = false;

  this.freqMutator = 1;
  this.freq2Mutator = 1;
  this.timeMutator = 1;
};

BeepMaker.prototype.beep = function(frequency, frequency2, type, durationSeconds, volume) {
  if (this.muted) {
    return;
  }

  frequency = frequency * this.freqMutator;
  frequency2 = frequency2 * this.freq2Mutator;
  durationSeconds = durationSeconds * this.timeMutator;

  var ctx = this.context;
  var osc = ctx.createOscillator();
  var gainOsc = ctx.createGain();

  var vol = volume || 1;
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(frequency2, ctx.currentTime + durationSeconds/2);
  osc.frequency.exponentialRampToValueAtTime(frequency, ctx.currentTime + durationSeconds);

  gainOsc.gain.setValueAtTime(vol, ctx.currentTime);
  gainOsc.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

  osc.connect(gainOsc);
  gainOsc.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationSeconds);
};

BeepMaker.prototype.pureBeep = function(frequency, frequency2, type, durationSeconds, volume) {
  if (this.muted) {
    return;
  }
  var ctx = this.context;
  var osc = ctx.createOscillator();
  var gainOsc = ctx.createGain();

  var vol = volume || 1;
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(frequency2, ctx.currentTime + durationSeconds/2);
  osc.frequency.exponentialRampToValueAtTime(frequency, ctx.currentTime + durationSeconds);

  gainOsc.gain.setValueAtTime(vol, ctx.currentTime);
  gainOsc.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

  osc.connect(gainOsc);
  gainOsc.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationSeconds);
};

BeepMaker.prototype.playNotes = function(notes) {
  if (this.muted) {
    return;
  }
  var ctx = this.context;
  var wholeNoteSeconds = 2;
  var startTime = ctx.currentTime;
  var time = ctx.currentTime;
  var osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  var gainOsc = ctx.createGain();
  notes.forEach(function(note) {
    var noteSeconds = wholeNoteSeconds * note.duration;
    osc.frequency.setValueAtTime(note.frequency, time);
    gainOsc.gain.setValueAtTime(1, time);
    gainOsc.gain.exponentialRampToValueAtTime(0.01, time + note.duration);
    time += noteSeconds;
  });
  osc.connect(gainOsc);
  gainOsc.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(time);
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

