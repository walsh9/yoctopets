/** @constructor */
function Pet(options) {
  this.tileData = options.tileData;
  this.sound = options.sound;
  // form = [head tile row, body tile row] 
  this.form = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
  this.x = 9;
  this.mood = 0;
  this.millisecondsAlive = 0;
  this.health = 100;
  this.hunger = 0;
  return this;
}

Pet.prototype.update = function(time) {
  this.millisecondsAlive += time;
  this.hunger += 0.001 * time;
  this.x += Math.random() > 0.5 ? 1 : -1;
  this.mood = this.mood ? 0 : 1;
};

Pet.prototype.render = function(display) {
  this._drawPetTile(display, this.x, 0, this.mood, this.form[0] * 2);
  this._drawPetTile(display, this.x, this.tileData.tileHeight, this.mood, this.form[1] * 2 + 1);
};

/** @private */
Pet.prototype._drawPetTile = function(display, x, y, column, row) {
  display.drawTile(this.tileData, column, row, x, y);
};
