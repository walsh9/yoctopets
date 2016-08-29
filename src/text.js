Game.Text = {};

Game.Text.init = function(options) {
  this.tileData = options.tileData;
  this.letters = options.letters;
};

Game.Text.drawLetter = function(x, y, letter) {
  var letterColumn = this.letters.indexOf(letter);
  Game.Graphics.drawTile(this.tileData, letterColumn, 0, x, y);
};

Game.Text.drawText = function(x, y, text) {
  for (var i = 0; i < text.length; i++) {
    console.log(x + i * (this.tileData.tileWidth + 1));
    this.drawLetter(x + i * (this.tileData.tileWidth + 1), y, text.charAt(i));
  }
};
