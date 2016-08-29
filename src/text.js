/** @constructor */
var TextDrawer = function(options) {
  this.tileData = options.tileData;
  this.letters = options.letters;
};

TextDrawer.prototype.drawLetter = function(display, x, y, letter) {
  var letterColumn = this.letters.indexOf(letter);
  display.drawTile(this.tileData, letterColumn, 0, x, y);
};

TextDrawer.prototype.drawText = function(display, x, y, text) {
  for (var i = 0; i < text.length; i++) {
    console.log(x + i * (this.tileData.tileWidth + 1));
    this.drawLetter(display, x + i * (this.tileData.tileWidth + 1), y, text.charAt(i));
  }
};
