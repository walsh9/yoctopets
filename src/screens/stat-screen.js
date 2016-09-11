/** @constructor */
var StatScreen = function(game) {
  this.pet = game.Pet;
  this.text = game.Text;
  this.sound = game.Sound;
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
  var age = 'yrs ' + Math.floor(this.pet.millisecondsAlive / 30000);
  var weight = 'lbs ' + Math.floor(this.pet.weight * 10) / 10;

  display.clearScreen();
  switch(this.currentPage) {
  case 0:
    this.text.drawText(display, 2, 1, age);
    this.text.drawText(display, 2, 7, weight);
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
};