function initGame(imageData) {
  var petTiles = Graphics.initTiles(imageData[0], PET_TILE_WIDTH, PET_TILE_HEIGHT);
  var fontTiles = Graphics.initTiles(imageData[1], FONT_TILE_WIDTH,FONT_TILE_HEIGHT);
  var foodTiles = Graphics.initTiles(imageData[2], FOOD_TILE_WIDTH,FOOD_TILE_HEIGHT);

  Game.icons = Graphics.initTiles(imageData[3], ICON_TILE_WIDTH, ICON_TILE_HEIGHT);

  Game.ticks = 0;
  Game.Sound = new BeepMaker();
  Game.Display = new PixelDisplay(CANVAS, PIXEL_SIZE);

  Game.Printer = new Printer(Game.Display, Game.Sound, '#p');
  Game.Food = new Food(FOOD_MENU, foodTiles);
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

  Game.Screen.open(new MainScreen(Game));
}

var timeStep = 400;
function run() {
  Game.ticks++;
  Game.Pet.update(timeStep);
  Game.Screen.updateCurrent(timeStep);
  Game.Screen.renderCurrent(Game.Display);
  setTimeout(run, timeStep);
}

Promise.all([
  Graphics.createImgData(PET_TILE_DATA), 
  Graphics.createImgData(FONT_TILE_DATA),
  Graphics.createImgData(FOOD_TILE_DATA),
  Graphics.createImgData(ICON_TILE_DATA)
  ])
.then(function(iData) {
  initGame(iData);
  run();
});

