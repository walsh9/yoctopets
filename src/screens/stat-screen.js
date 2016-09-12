/** @constructor */
var StatScreen = function(game) {
  this.game = game;
  this.pet = game.pet;
  this.text = game.text;
  this.sound = game.sound;
  this.currentPage = 0;
  this.actions = {
    'yes': function() {
      this.manager.closeCurrent();
    },
    'no': function() {
      this.manager.closeCurrent();
    },
    'right': function() {
      this.currentPage = Math.mod(this.currentPage + 1, 4);
    },
    'left': function() {
      this.currentPage = Math.mod(this.currentPage - 1, 4);
    },
  };
};
StatScreen.prototype.update = function() {};
StatScreen.prototype.render = function(display) {
  var name = this.pet.name;
  var age = 'yrs ' + this.pet.ageInYears();

  if (this.pet.whining && this.game.ticks % 2 === 0) {
      this.sound.beep(500, 600, 'sawtooth', 0.3);
  }

  display.clearScreen();
  switch(this.currentPage) {
  case 0:
    this.text.drawText(display, 2, 1, name);
    this.text.drawText(display, 2, 7, age);
  break;
  case 1:
    this.text.drawText(display, 2, 1, 'hungry');
    this.text.drawMeter(display, this.pet.hungry);
  break;
  case 2:
    this.text.drawText(display, 2, 1, 'bored');
    this.text.drawMeter(display, this.pet.bored);
  break;
  case 3:
    this.text.drawText(display, 2, 1, 'filthy');
    this.text.drawMeter(display, this.pet.filthy);
  }
  this.text.drawArrows(display);
  display.outputBuffer();
};