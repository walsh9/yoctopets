/** @constructor */
var EvolveScreen = function(game, params) {
  this.pet = game.pet;
  this.newForm = params.newForm;
  this.sound = game.sound;
  this.timer = 10;
  this.actions = {};
};
EvolveScreen.prototype.update = function() {
  this.timer--;
  if (this.timer <= 0) {
    this.manager.closeCurrent();
  }
};
EvolveScreen.prototype.render = function(display) {
  this.pet.frames = [0,0];
  this.pet.x = this.timer % 2 + 8;
  if (this.timer > 3) {
    this.sound.beep(800, 6, 'sawtooth', 0.3);
  }
  if (this.timer === 3) {
    this.pet.isBaby = false;
    this.pet.isAdult = true;
    this.pet.form = this.newForm;
    this.sound.beep(2000, 10, 'square', 0.45);
  }
  display.clearScreen();
  this.pet.render(display);
  display.outputBuffer();
};