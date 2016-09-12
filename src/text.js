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
  if (x === 'center') {
    x = Math.floor((display.pixelWidth - text.length * (this.tileData.tileWidth + 1)) / 2);
  }
  for (var i = 0; i < text.length; i++) {
    this.drawLetter(display, x + i * (this.tileData.tileWidth + 1), y, text.charAt(i));
  }
};

TextDrawer.prototype.drawArrows = function(display) {
  this.drawText(display, 0, 12, '<');
  this.drawText(display, 29, 12, '>');
};

TextDrawer.prototype.drawMeter = function(display, n) {
  n = Math.min(n, 100);
  var bars = Math.floor(n/100 * 7);
  var meter = '#######'.slice(0, bars) + '|||||||'.slice(0, 7 - bars);
  this.drawText(display, 2, 7, meter);
};
