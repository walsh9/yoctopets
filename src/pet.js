/**
 * A pet.
 * @constructor
 */
function Pet(options) {
  this.tileData = options.tileData;
  // form = [head tile row, body tile row] 
  this.form = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
  this.x = 9;
  this.mood = 0;
  return this;
}

Pet.prototype.update = function(time) {
  this.x += Math.random() > 0.5 ? 1 : -1;
  this.mood = this.mood ? 0 : 1;
};

Pet.prototype.render = function() {
  this._drawPetTile(this.x, 0, this.mood, this.form[0] * 2);
  this._drawPetTile(this.x, this.tileData.tileHeight, this.mood, this.form[1] * 2 + 1);
};

Pet.prototype._drawPetTile = function(x, y, column, row) {
  Game.Graphics.drawTile(this.tileData, column, row, x, y);
};
