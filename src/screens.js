/** @constructor */
var ScreenManager = function(sound) {
  this.screenStack = [];
  this.sound = sound;
};

ScreenManager.prototype.getCurrent = function() {
  if (this.screenStack.length > 0) {
    return this.screenStack.slice(-1)[0];
  } else {
    return new NullScreen();
  }
};

ScreenManager.prototype.renderCurrent = function(display, timeDelta) {
  this.getCurrent().render(display, timeDelta);
};

ScreenManager.prototype.updateCurrent = function(time) {
  this.getCurrent().update(time);
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
  this.screenStack.push(screen);
};

/** @constructor */
var NullScreen = function() {
  this.actions = {};
};
NullScreen.prototype.render  = function() {};
NullScreen.prototype.update  = function() {};

/** @constructor */
var MainScreen = function(sound) {
  this.sound = sound;
  this.selectedIcon = 0;
  this.actions = {
    'switchIn': function() {
      Game.Pet.x = 8;
    },
    'left': function() {
      var nextIcon = this.selectedIcon > 0 ? this.selectedIcon - 1 : 7;
      this._switchIcon(nextIcon);
    },
    'right': function() {
      var nextIcon = this.selectedIcon < 7 ? this.selectedIcon + 1 : 0;
      this._switchIcon(nextIcon);
    },
  };
};
MainScreen.prototype.render = function(display) {
  display.clearScreen();
  Game.Pet.render(display);  
};
MainScreen.prototype.update  = function() {};
/** @private */
MainScreen.prototype._switchIcon = function(i) {
  var currentIcon = document.querySelector('#i-' + this.selectedIcon);
  var newIcon = document.querySelector('#i-' + i);
  currentIcon.setAttribute('class', '');
  newIcon.setAttribute('class', 'active');
  this.selectedIcon = i;
};




