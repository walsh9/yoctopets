var audioContext = window.AudioContext || window.webkitAudioContext;
var A_CTX = new audioContext();

Game.Sound = {};

Game.Sound.muted = false;

Game.Sound.beep = function(frequency, frequency2, type, durationSeconds) {
  if (!Game.Sound.muted) {
    var osc = A_CTX.createOscillator();
    var gainOsc = A_CTX.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, A_CTX.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency2, A_CTX.currentTime + durationSeconds/2);
    osc.frequency.exponentialRampToValueAtTime(frequency, A_CTX.currentTime + durationSeconds);

    gainOsc.gain.setValueAtTime(1, A_CTX.currentTime);
    gainOsc.gain.exponentialRampToValueAtTime(0.001, A_CTX.currentTime + durationSeconds);

    osc.connect(gainOsc);
    gainOsc.connect(A_CTX.destination);

    osc.start(A_CTX.currentTime);
    osc.stop(A_CTX.currentTime + durationSeconds);
  }
};

Game.Sound.toggleMute = function() {
  Game.Sound.muted = !Game.Sound.muted;
  return Game.Sound.muted;
};

Game.Sound.mute = function() {
  Game.Sound.muted = true;
};

Game.Sound.unmute = function() {
  Game.Sound.muted = false;
};

