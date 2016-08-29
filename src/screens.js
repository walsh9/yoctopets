/** @constructor */
var ScreenManager = function(sound) {
  this.screenStack = [];
  this.sound = sound;
};

ScreenManager.prototype.getCurrent = function() {
  if (this.screenStack.length > 0) {
    return this.screenStack.slice(-1)[0];
  } else {
    return Game.ScreenTemplates.Null;
  }
};

ScreenManager.prototype.renderCurrent = function(display, timeDelta) {
  this.getCurrent().render(display, timeDelta);
};

ScreenManager.prototype.updateCurrent = function() {
  this.getCurrent().update();
};

ScreenManager.prototype.sendCurrent = function(eventName) {
  var currentScreen = this.getCurrent();
  var params = Array.prototype.slice.call(arguments, 1);
  if (typeof currentScreen.actions[eventName] === 'function') {
    currentScreen.actions[eventName].apply(currentScreen, params);
  }
};

ScreenManager.prototype.closeCurrent = function() {
  this.sendCurrent('switchOut');
  this.screenStack.pop();
  this.sendCurrent('switchIn');
};

ScreenManager.prototype.open = function(screen) {
  this.sendCurrent('switchOut');
  screen.init(this.sound);
  this.screenStack.push(screen);
};

Game.ScreenTemplates = {};

Game.ScreenTemplates.Null = {
  init: function() {},
  render: function() {},
  update: function() {},
  actions: {},
};

Game.ScreenTemplates.Main = {
  init: function(sound) {
    Game.ScreenTemplates.Main.sound = sound;
    Game.ScreenTemplates.Main.selectedOption = 0;
  },
  render: function(display, timeDelta) {
    display.clearScreen();
    Game.Pet.render(display, timeDelta);
  },
  update: function() {
    Game.Pet.update();
  },
  actions: {
    'switchIn': function() {
      Game.Pet.x = 8;
    }
  }
};