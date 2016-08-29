Game.Text = {};

Game.Text.init = function(options) {
  Game.Text.tileData = options.tileData;
  Game.Text.letters = options.letters;
};

Game.Text.drawLetter = function(x, y, letter) {
  var letterColumn = Game.Text.letters.indexOf(letter);
  Game.Graphics.drawTile(Game.Text.tileData, letterColumn, 0, x, y);
};

Game.Text.drawText = function(x, y, text) {
  for (var i = 0; i < text.length; i++) {
    console.log(x + i * (Game.Text.tileData.tileWidth + 1));
    Game.Text.drawLetter(x + i * (Game.Text.tileData.tileWidth + 1), y, text.charAt(i));
  }
};
