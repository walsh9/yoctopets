/** @constructor */
var EmoteScreen = function(game, params) {
  this.game = game;
  this.pet = game.Pet;
  this.emote = params.emote;
  this.oldFrames = this.pet.frames;
  this.countdown = params.duration || 6;
  this.icon = 0;
  this.actions = {};
};
EmoteScreen.prototype.update = function(time) {
  this.countdown -= 1;
  if (this.countdown === 0) {
    this.pet.frames = this.oldFrames;
    this.pet.dirs = [0, 0];
    this.manager.closeCurrent();
  }
};
EmoteScreen.prototype.render = function(display) { 
  switch(this.emote) {
  case 'refuse':
    this.pet.frames = [4,4];
    this.pet.dirs = [this.game.ticks % 2,0];
    this.icon = 5;
    break;
  case 'disapprove':
    this.pet.frames = [5,5];
    this.icon = 3;
    break;
  case 'approve':
    this.pet.frames = [7,7];
    this.icon = 2;
    break;
  }
  display.clearScreen();
  this.pet.x = 8;
  this.pet.render(display);
  display.drawTile(this.game.icons, this.game.ticks % 2, this.icon, 24, 1);
  display.drawTile(this.game.icons, this.game.ticks % 2, this.icon, 0, 1);
};