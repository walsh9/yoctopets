/** @constructor */
var ScreenManager = function() {
  this.screenStack = [];
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

ScreenManager.prototype.insert = function(screen, n) {
  screen.manager = this;
  if (this.screenStack.length <= n) {
    this.sendCurrent('switchOut');
    this.screenStack.push(screen);
  } else {
    this.screenStack.splice(n, 0, screen);
  }
};