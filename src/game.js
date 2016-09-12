var Game = {};

function initGame(imageData) {
  var petTiles = Graphics.initTiles(imageData[0], PET_TILE_WIDTH, PET_TILE_HEIGHT);
  var fontTiles = Graphics.initTiles(imageData[1], FONT_TILE_WIDTH,FONT_TILE_HEIGHT);
  var foodTiles = Graphics.initTiles(imageData[2], FOOD_TILE_WIDTH,FOOD_TILE_HEIGHT);

  Game.icons = Graphics.initTiles(imageData[3], ICON_TILE_WIDTH, ICON_TILE_HEIGHT);

  Game.ticks = 0;
  Game.sound = new BeepMaker();
  Game.display = new PixelDisplay(CANVAS, PIXEL_SIZE, Game);

  Game.printer = new Printer(Game.display, Game.sound, '#p');
  Game.food = new Food(FOOD_MENU, foodTiles);
  Game.pet = new Pet({tileData: petTiles, game: Game});
  Game.text = new TextDrawer({
    tileData: fontTiles, 
    letters: "abcdefghijklmnopqrstuvwxyz1234567890.!?:;+-'\" <>()[]{}#|"
  });

  Game.screens = new ScreenManager();

  function bindInput(id, message, callback, context) {
    document.querySelector('#' + id).addEventListener('click', function() {
      callback.call(context, message);
    });
  }
  bindInput('l', 'left', Game.screens.sendCurrent, Game.screens);
  bindInput('r', 'right', Game.screens.sendCurrent, Game.screens);
  bindInput('y', 'yes', Game.screens.sendCurrent, Game.screens);
  bindInput('n', 'no', Game.screens.sendCurrent, Game.screens);

  Game.screens.open(new MainScreen(Game));
  Game.screens.open(new EggScreen(Game));
}

Game.timeStep = 400;
function run() {
  Game.ticks++;
  Game.pet.update(Game.timeStep);
  Game.screens.updateCurrent(Game.timeStep);
  Game.screens.renderCurrent(Game.display);
  setTimeout(run, Game.timeStep);
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

