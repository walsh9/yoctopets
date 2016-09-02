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

ScreenManager.prototype.renderCurrent = function(display) {
  this.getCurrent().render(display);
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
  screen.manager = this;
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
    'right': function() {
      var nextIcon = Math.mod(this.selectedIcon + 1, 7);
      this._switchIcon(nextIcon);
    },
    'left': function() {
      var nextIcon = Math.mod(this.selectedIcon - 1, 7);
      this._switchIcon(nextIcon);
    },
    'yes': function() {
      this.manager.open(new StatScreen(this.sound));
    }
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
  this.sound.beep(2000, 3100, 'square', 0.2);
};

/** @constructor */
var StatScreen = function(sound) {
  this.sound = sound;
  this.currentPage = 0;
  this.actions = {
    'yes': function() {
      this.manager.closeCurrent();
    },
    'no': function() {
      this.manager.closeCurrent();
    },
    'right': function() {
      this.currentPage = Math.mod(this.currentPage + 1, 4);
    },
    'left': function() {
      this.currentPage = Math.mod(this.currentPage - 1, 4);
    },
  };
};
StatScreen.prototype.update = function() {};
StatScreen.prototype.render = function(display) {
  display.clearScreen();
  var age = 'yrs ' + Math.floor(Game.Pet.millisecondsAlive / 30000);
  var weight = 'lbs ' + Math.floor(Game.Pet.weight * 10) / 10;
  switch(this.currentPage) {
    case 0:
      Game.Text.drawText(display, 2, 1, age);
      Game.Text.drawText(display, 2, 7, weight);
    break;
    case 1:
      Game.Text.drawText(display, 2, 1, 'hungry');
      Game.Text.drawMeter(display, Game.Pet.hungry);
    break;
    case 2:
      Game.Text.drawText(display, 2, 1, 'bored');
      Game.Text.drawMeter(display, Game.Pet.bored);
    break;
    case 3:
      Game.Text.drawText(display, 2, 1, 'filthy');
      Game.Text.drawMeter(display, Game.Pet.filthy);
  }
  Game.Text.drawArrows(display);
};
