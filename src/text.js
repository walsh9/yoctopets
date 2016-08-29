/** @constructor */
var TextDrawer = function(tileData, letters, display) {
  this.tileData = tileData;
  this.letters = letters;
  this.display = display;
};

TextDrawer.prototype.drawLetter = function(x, y, letter) {
  var letterColumn = this.letters.indexOf(letter);
  this.display.drawTile(this.tileData, letterColumn, 0, x, y);
};

TextDrawer.prototype.drawText = function(x, y, text) {
  for (var i = 0; i < text.length; i++) {
    console.log(x + i * (this.tileData.tileWidth + 1));
    this.drawLetter(x + i * (this.tileData.tileWidth + 1), y, text.charAt(i));
  }
};
