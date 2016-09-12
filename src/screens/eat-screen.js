/** @constructor */
var EatScreen = function(game, params) {
  this.game = game;
  this.pet = game.pet;
  this.food = game.food;
  this.oldFrames = this.pet.frames;
  this.foodId = params.foodId;
  this.sound = game.sound;
  this.actions = {};
  this.countdown = 8;
};
EatScreen.prototype.update = function(time) {
  this.countdown -= 1;
  if (this.countdown === 0) {
    this.pet.frames = this.oldFrames;
    this.pet.applyGlitch(this.food.menu[this.foodId].glitch);
    this.manager.closeCurrent();
  }
};
EatScreen.prototype.render = function(display) { 
  display.clearScreen();
  this.pet.x = 12;
  this.pet.frames = [2,3];
  this.pet.render(display);
  var foodFrame;
  if (this.game.ticks % 2 === 0 && this.countdown < 7) {
    this.sound.beep('600', '30', 'sawtooth', 0.4);
  }
  if (this.countdown > 5) {
    foodFrame = this.countdown % 2;
  } else if (this.countdown > 3) {
    foodFrame = 2;
  } else if (this.countdown > 1) {
    foodFrame = 3;
  }
  if (this.countdown > 1) {
    this.game.food.drawFoodTile(display, this.foodId, foodFrame, 4, 8); 
  }
  display.outputBuffer();
};