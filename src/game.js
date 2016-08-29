function initGame(imageData) {
  var petTiles = imageData[0];
  petTiles.tileWidth = PET_TILE_WIDTH;
  petTiles.tileHeight = PET_TILE_HEIGHT;

  var fontTiles = imageData[1];
  fontTiles.tileWidth = FONT_TILE_WIDTH;
  fontTiles.tileHeight = FONT_TILE_HEIGHT;

  Game.pet = new Pet({tileData: petTiles});
  Game.Text.init({
    tileData: fontTiles, 
    letters:'abcdefghijklmnopqrstuvwxyz1234567890.!?><+- #|\_:;'
  });

  Game.Screens.open(Game.Screens.Main);
}

function run() {
  Game.Screens.updateCurrent();
  Game.Screens.renderCurrent();
  setTimeout(run, 400);
}

Promise.all([Game.Graphics.createImgData(PET_TILE_DATA),
             Game.Graphics.createImgData(FONT_TILE_DATA)])
.then(function(iData) {
  initGame(iData);
  run();
});

