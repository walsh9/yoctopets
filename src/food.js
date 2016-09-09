/** @constructor */
var Food = function(menu, tileData) {
  this.menu = menu;
  this.tileData = tileData;
};

Food.prototype.getFoodList = function() {
  return this.menu;
};

Food.prototype.drawFoodTile = function(display, tileId, frameId, x, y) {
  display.drawTile(this.tileData, frameId, tileId, x, y);
};