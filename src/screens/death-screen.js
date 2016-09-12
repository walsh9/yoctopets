/** @constructor */
var DeathScreen = function(game) {
  game.sound.playNotes(CHOPINS_FUNERAL_MARCH);
  this.name = game.pet.name || '';
  this.text = game.text;
  this.actions = {};
};
DeathScreen.prototype.update = function() {};
DeathScreen.prototype.render = function(display) {
  display.clearScreen();
  display.drawHorizontalLine(5, 1, 3, true);
  display.drawHorizontalLine(8, 0, 15, true);
  display.drawHorizontalLine(23, 1, 3, true);
  display.drawVerticalLine(4, 2, 15, true);
  display.drawVerticalLine(26, 2, 15, true);
  this.text.drawText(display, 'center', 3, 'rip');
  this.text.drawText(display, 'center', 9, this.name);

  display.outputBuffer();
};