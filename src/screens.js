Game.Screens = {};

Game.Screens.screenStack = [];

Game.Screens.getCurrent = function() {
  if (this.screenStack.length > 0) {
    return this.screenStack.slice(-1)[0];
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
  this.getCurrent().render();
};

Game.Screens.updateCurrent = function() {
  this.getCurrent().update();
};

Game.Screens.sendCurrent = function(eventName) {
  var currentScreen = this.getCurrent();
  var params = Array.prototype.slice.call(arguments, 1);
  if (typeof currentScreen.actions[eventName] === 'function') {
    currentScreen.actions[eventName].apply(currentScreen, params);
  }
};

Game.Screens.closeCurrent = function() {
  this.sendCurrent('switchOut');
  this.screenStack.pop();
  this.sendCurrent('switchIn');
};

Game.Screens.open = function(screen) {
  this.sendCurrent('switchOut');
  screen.init();
  this.screenStack.push(screen);
};

Game.Screens.Main = {
  init: function() {
    this.selectedOption = 0;
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