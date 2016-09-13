/** @constructor */
var EggScreen = function(game) {
  this.pet = game.pet;
  this.sound = game.sound;
  this.icons = game.icons;
  this.hatchTimer = 40;
  this.actions = {};
  this.x = 12;
  this.frame = 0;
};
EggScreen.prototype.update = function() {
  this.hatchTimer--;
  if (this.hatchTimer <= 0) {
    this.pet.getBorn();
    this.sound.beep(500, 6, 'square', 0.3);
    this.manager.closeCurrent();
  }
};
EggScreen.prototype.render = function(display) {
  if (this.hatchTimer <  30) {
    this.x = this.hatchTimer % 2 + 12;
    this.sound.beep(300, 500, 'sine', 0.4);
  }
  if (this.hatchTimer ===  5) {
    this.frame = 1;
    this.sound.beep(2000, 10, 'square', 0.1);
  }
  display.clearScreen();
  display.drawTile(this.icons, this.frame, 7, this.x, 8);
  display.outputBuffer();
};