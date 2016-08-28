Game.Screens = {};

Game.Screens.stack = [];

Game.Screens.getCurrent = function() {
  if (this.stack.length > 0) {
    return this.stack.slice(-1)[0];
  } else {
    return Game.Screens.Null;
  }
};

Game.Screens.Null = {
  init: function() {},
  render: function() {},
  update: function() {},
  onSwitchIn: function() {},
  onSwitchOut: function() {},
  on: function() {}
};

Game.Screens.renderCurrent = function() {
  this.getCurrent().render();
};

Game.Screens.updateCurrent = function() {
  this.getCurrent().update();
};

Game.Screens.sendCurrent = function(event) {
  this.getCurrent().on(event);
};

Game.Screens.closeCurrent = function() {
  this.getCurrent().onSwitchOut();
  this.stack.pop();
  this.getCurrent().onSwitchIn();
};

Game.Screens.open = function(screen) {
  this.getCurrent().onSwitchOut();
  screen.init();
  this.stack.push(screen);
};

Game.Screens.Main = {
  init: function() {
    this.selectedOption = 0;
  },
  render: function() {
    Game.Graphics.clearScreen();
    drawCreature(creature, creatureX, creatureMood);
  },
  update: function() {
    creatureX += Math.random() > 0.5 ? 1 : -1;
    creatureMood = creatureMood ? 0 : 1;
    creatureMood = Math.floor(Math.random() * 2);
  },
  onSwitchIn: function() {
    creatureX = 8;
  },
  onSwitchOut: function() {

  },
  on: function(event) {

  }
};