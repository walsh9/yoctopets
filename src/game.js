function initGame(imageData) {
  var petTiles = imageData[0];
  petTiles.tileWidth = PET_TILE_WIDTH;
  petTiles.tileHeight = PET_TILE_HEIGHT;

  var fontTiles = imageData[1];
  fontTiles.tileWidth = FONT_TILE_WIDTH;
  fontTiles.tileHeight = FONT_TILE_HEIGHT;

  Game.Sound = new BeepMaker();
  Game.Display = new PixelDisplay(CANVAS, PIXEL_SIZE);

  Game.Pet = new Pet({tileData: petTiles});
  Game.Text = new TextDrawer({
    tileData: fontTiles, 
    letters: 'abcdefghijklmnopqrstuvwxyz1234567890.!?><+- #|\_:;'
  });

  Game.Screens = new ScreenManager(Game.Sound);
  Game.Screens.open(Game.ScreenTemplates.Main);
}

function run() {
  Game.Screens.updateCurrent();
  Game.Screens.renderCurrent(Game.Display, 400);
  setTimeout(run, 400);
}

Promise.all([CreateImgData(PET_TILE_DATA), CreateImgData(FONT_TILE_DATA)])
.then(function(iData) {
  initGame(iData);
  run();
});

