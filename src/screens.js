Game.Screens = {};

Game.Screens.screenStack = [];

Game.Screens.getCurrent = function() {
  if (Game.Screens.screenStack.length > 0) {
    return Game.Screens.screenStack.slice(-1)[0];
  } else {
    return Game.Screens.Null;
  }
};

Game.Screens.Null = {
  init: function() {},
  render: function() {},
  update: function() {},
  actions: {},
};

Game.Screens.renderCurrent = function() {
  Game.Screens.getCurrent().render();
};

Game.Screens.updateCurrent = function() {
  Game.Screens.getCurrent().update();
};

Game.Screens.sendCurrent = function(eventName) {
  var currentScreen = Game.Screens.getCurrent();
  var params = Array.prototype.slice.call(arguments, 1);
  if (typeof currentScreen.actions[eventName] === 'function') {
    currentScreen.actions[eventName].apply(currentScreen, params);
  }
};

Game.Screens.closeCurrent = function() {
  Game.Screens.sendCurrent('switchOut');
  Game.Screens.screenStack.pop();
  Game.Screens.sendCurrent('switchIn');
};

Game.Screens.open = function(screen) {
  Game.Screens.sendCurrent('switchOut');
  screen.init();
  Game.Screens.screenStack.push(screen);
};

Game.Screens.Main = {
  init: function() {
    Game.Screens.Main.selectedOption = 0;
  },
  render: function() {
    Game.Graphics.clearScreen();
    Game.pet.render();
  },
  update: function() {
    Game.pet.update();
  },
  actions: {
    'switchIn': function() {
      Game.pet.x = 8;
    }
  }
};