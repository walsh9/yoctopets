/** @constructor */
var ClockScreen = function(game) {
  this.game = game;
  this.pet = game.pet;
  this.sound = game.sound;
  this.text = game.text;
  this.actions = {
    'yes': function() {
      this.manager.closeCurrent();
    },
    'no': function() {
      this.manager.closeCurrent();
    }
  };
};
ClockScreen.prototype.update = function() {};
ClockScreen.prototype.render = function(display) {
  var now = new Date();
  var minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
  var hours = Math.mod(now.getHours() - 1, 12) + 1;
  hours = hours < 10 ? ' ' + hours : hours;
  var amPm = now.getHours() < 12 ? 'am' : 'pm';
  var year = '1996';

  if (this.pet.whining && this.game.ticks % 2 === 0) {
    this.sound.beep(500, 600, 'sawtooth', 0.3);
  }
  
  display.clearScreen();
  this.text.drawText(display, 2, 2, hours + ':' + minutes + amPm);
  this.text.drawText(display, 7, 9, year);
  display.outputBuffer();
};