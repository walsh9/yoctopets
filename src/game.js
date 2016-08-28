
var creature = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)]; 
var creatureX = 9;
var creatureMood = 0;
// head tile row, body tile row 

function drawCreatureTile(x, y, column, row) {
  Game.Graphics.drawTile(creatureTiles, column, row, x, y);
}

function drawCreature(creature, x, mood) {
  drawCreatureTile(x, 0, mood, creature[0] * 2);
  drawCreatureTile(x, creatureTiles.tileHeight, mood, creature[1] * 2 + 1);
}

function drawLetter(x, y, letter) {
  var letterColumn = letters.indexOf(letter);
  drawTile(fontTiles, letterColumn, 0, x, y);
}

function drawText(x, y, text) {
  for (var i = 0; i < text.length; i++) {
    console.log(x + i * (fontTiles.tileWidth + 1));
    drawLetter(x + i * (fontTiles.tileWidth + 1), y, text.charAt(i));
  }
}

function drawScreen(){
  Game.Graphics.clearScreen();
  drawCreature(creature, creatureX, creatureMood);
}

var imageData, fontData, creatureTiles, fontTiles;
var letters='abcdefghijklmnopqrstuvwxyz1234567890.!?><+- #|\_:;';

Promise.all([Game.Graphics.createImgData(CREATURE_TILE_DATA),
             Game.Graphics.createImgData(FONT_TILE_DATA)])
.then(function(iData) {
  creatureTiles = iData[0];
  creatureTiles.tileWidth = CREATURE_TILE_WIDTH;
  creatureTiles.tileHeight = CREATURE_TILE_HEIGHT;

  fontTiles = iData[1];
  fontTiles.tileWidth = FONT_TILE_WIDTH;
  fontTiles.tileHeight = FONT_TILE_HEIGHT;

  run();
});

function updateCreature() {
  creatureX += Math.random() > 0.5 ? 1 : -1;
  creatureMood = creatureMood ? 0 : 1;
  creatureMood = Math.floor(Math.random() * 2);
}

function run() {
  updateCreature();
  drawScreen();
  setTimeout(run, 400);
}



