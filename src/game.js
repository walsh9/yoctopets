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
    letters: "abcdefghijklmnopqrstuvwxyz1234567890.!?:;+-'\" <>()[]{}#|"
  });

  Game.Screen = new ScreenManager(Game.Sound);

  function bindInput(id, message, callback, context) {
    document.querySelector('#' + id).addEventListener('click', function() {
      callback.call(context, message);
    });
  }
  bindInput('l', 'left', Game.Screen.sendCurrent, Game.Screen);
  bindInput('r', 'right', Game.Screen.sendCurrent, Game.Screen);
  bindInput('y', 'yes', Game.Screen.sendCurrent, Game.Screen);
  bindInput('n', 'no', Game.Screen.sendCurrent, Game.Screen);

  Game.Screen.open(new MainScreen(Game.Sound));
}

var timeStep = 400;
function run() {
  Game.Pet.update(timeStep);
  Game.Screen.updateCurrent(timeStep);
  Game.Screen.renderCurrent(Game.Display);
  setTimeout(run, timeStep);
}

Promise.all([CreateImgData(PET_TILE_DATA), CreateImgData(FONT_TILE_DATA)])
.then(function(iData) {
  initGame(iData);
  run();
});

