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
      switch(this.selectedIcon) {
      case 0:
        this.manager.open(new FoodPickerScreen(this.sound));
        break;
      case 1:
        this.manager.open(new EmoteScreen('refuse'));
        break;
      case 2:
        this.manager.open(new GameScreen(this.sound));
        break;
      case 3:
        this.manager.open(new EmoteScreen('refuse'));
        break;
      case 4:
        this.manager.open(new StatScreen(this.sound));
        break;
      case 5:
        this.manager.open(new ClockScreen());
        break;
      case 6:
        var printStatus = Game.Printer.print();
        if (printStatus !== 'ok') {
          this.manager.open(new ErrorScreen(printStatus, 3000));
        }
        break;
      }
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
  var age = 'yrs ' + Math.floor(Game.Pet.millisecondsAlive / 30000);
  var weight = 'lbs ' + Math.floor(Game.Pet.weight * 10) / 10;

  display.clearScreen();
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


/** @constructor */
var ClockScreen = function() {
  this.actions = {
    'yes': function() {
      this.manager.closeCurrent();
    },
    'no': function() {
      this.manager.closeCurrent();
    }
  };
};
ClockScreen.prototype.update = function() {};
ClockScreen.prototype.render = function(display) {
  var now = new Date();
  var minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
  var hours = Math.mod(now.getHours() - 1, 12) + 1;
  hours = hours < 10 ? ' ' + hours : hours;
  var amPm = now.getHours() < 12 ? 'am' : 'pm';
  var year = '1996';
  
  display.clearScreen();
  Game.Text.drawText(display, 2, 2, hours + ':' + minutes + amPm);
  Game.Text.drawText(display, 7, 9, year);
};


/** @constructor */
var ErrorScreen = function(message, time) {
  this.message = message;
  this.time = time;
  this.actions = {
    'yes': function() {
      this.manager.closeCurrent();
    },
    'no': function() {
      this.manager.closeCurrent();
    }
  };
};
ErrorScreen.prototype.update = function(time) {
  if (this.time < 0) {
    this.manager.closeCurrent();
  }
  this.time -= time;
};
ErrorScreen.prototype.render = function(display) {
  display.clearScreen();
  Game.Text.drawText(display, 'center', 6, this.message);
};


/** @constructor */
var FoodPickerScreen = function(sound) {
  this.sound = sound;
  this.currentPage = 0;
  this.menu = Game.Food.getFoodList();
  this.numPages = this.menu.length;
  this.actions = {
    'yes': function() {
      this.manager.closeCurrent();
      this.manager.open(new EatScreen(sound, this.currentPage));
    },
    'no': function() {
      this.manager.closeCurrent();
    },
    'right': function() {
      this.currentPage = Math.mod(this.currentPage + 1, this.numPages);
    },
    'left': function() {
      this.currentPage = Math.mod(this.currentPage - 1, this.numPages);
    },
  };
};
FoodPickerScreen.prototype.update = function(time) {};
FoodPickerScreen.prototype.render = function(display) {
  display.clearScreen();
  Game.Food.drawFoodTile(display, this.currentPage, Game.ticks % 2, 12, 0);
  Game.Text.drawText(display, 'center', 10, this.menu[this.currentPage]);
  Game.Text.drawArrows(display);
};


/** @constructor */
var EatScreen = function(sound, foodId) {
  this.oldFrames = Game.Pet.frames;
  this.foodId = foodId;
  this.sound = sound;
  this.actions = {};
  this.countdown = 8;
};
EatScreen.prototype.update = function(time) {
  this.countdown -= 1;
  if (this.countdown === 0) {
    Game.Pet.frames = this.oldFrames;
    this.manager.closeCurrent();
  }
};
EatScreen.prototype.render = function(display) { 
  display.clearScreen();
  Game.Pet.x = 12;
  Game.Pet.frames = [2,3];
  Game.Pet.render(display);
  var foodFrame;
  if (this.countdown > 5) {
    foodFrame = this.countdown % 2;
  } else if (this.countdown > 3) {
    foodFrame = 2;
  } else if (this.countdown > 1) {
    foodFrame = 3;
  }
  if (this.countdown > 1) {
    Game.Food.drawFoodTile(display, this.foodId, foodFrame, 4, 8); 
  }
};



/** @constructor */
var EmoteScreen = function(emote) {
  this.emote = emote;
  this.oldFrames = Game.Pet.frames;
  this.countdown = 8;
  this.icon = 0;
  this.actions = {};
};
EmoteScreen.prototype.update = function(time) {
  this.countdown -= 1;
  if (this.countdown === 0) {
    Game.Pet.frames = this.oldFrames;
    Game.Pet.dirs = [0, 0];
    this.manager.closeCurrent();
  }
};
EmoteScreen.prototype.render = function(display) { 
  switch(this.emote) {
  case 'refuse':
    Game.Pet.frames = [4,4];
    Game.Pet.dirs = [Game.ticks % 2,0];
    this.icon = 5;
    break;
  case 'disapprove':
    Game.Pet.frames = [5,5];
    this.icon = 3;
    break;
  case 'approve':
    Game.Pet.frames = [7,7];
    this.icon = 2;
    break;
  }
  display.clearScreen();
  Game.Pet.x = 8;
  Game.Pet.render(display);
  display.drawTile(Game.icons, Game.ticks % 2, this.icon, 24, 1);
  display.drawTile(Game.icons, Game.ticks % 2, this.icon, 0, 1);
};

/** @constructor */
var GameScreen = function(sound) {
  this.sound = sound;
  this.deck = '23456789jqka'.split('');
  this.cards = shuffle(this.deck).slice(-4);
  this.selection = '<hi>';
  this.revealedCards = 1;
  this.score = 0;
  this.locked = 0;
  this.actions = {
    'right': function() {
      this.toggleSelection();
    },
    'left': function() {
      this.toggleSelection();
    },
    'yes': function() {
      if (this.locked <= 0) {
        this.revealCard(this.selection);
      }
    },
    'no': function() {
      this.manager.closeCurrent();
    },
  };

  function shuffle(array) {
    var a = array.slice(0);
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
    return a;
  }
};
GameScreen.prototype.update = function(time) {
  if (this.locked > 0) {
    this.locked--;
  } else {
    if (this.youLose) {
      this.manager.closeCurrent();
      this.manager.open(new EmoteScreen('disapprove'));
    } else if (this.youWin) {
      this.manager.closeCurrent();
      this.manager.open(new EmoteScreen('approve'));
    }
  }
};
GameScreen.prototype.render = function(display) { 
  var petFrame = Game.ticks % 2;
  display.clearScreen();
  display.drawTile(Game.Pet.tileData, petFrame, Game.Pet.form[0] * 2, 16, 0);
  display.drawVerticalLine(14, 8, 8);
  display.drawHorizontalLine(14, 8, 18);
  this.renderCard(display, 0, 0, 0);
  this.renderCard(display, 1, 7, 0);
  this.renderCard(display, 2, 0, 8);
  this.renderCard(display, 3, 7, 8);
  Game.Text.drawText(display, 16, 10, this.selection);
};
GameScreen.prototype.toggleSelection = function() {
  if (this.selection === '<hi>') {
    this.selection = '<lo>';
  } else {
    this.selection = '<hi>';
  }
};
GameScreen.prototype.renderCard = function(display, cardIndex, x, y) {
  if (cardIndex < this.revealedCards) {
    display.drawTile(Game.icons, 1, 6, x, y);
    Game.Text.drawText(display, x + 2, y + 2, this.cards[cardIndex]);
  } else {
    display.drawTile(Game.icons, 0, 6, x, y);
  }
};
GameScreen.prototype.getCardValue = function(card) {
  return this.deck.indexOf(card);
};
GameScreen.prototype.revealCard = function(selection) {
  this.locked = 2;
  this.revealedCards++;
  var newCard = this.getCardValue(this.cards[this.revealedCards - 1]);
  var oldCard = this.getCardValue(this.cards[this.revealedCards - 2]);
  if ((this.selection === '<hi>' && newCard > oldCard) ||
      (this.selection === '<lo>' && newCard < oldCard)) {
    this.score++;
    Game.Sound.beep(1500, 1500, 'sine', 0.4);
  } else {
    Game.Sound.beep(300, 300, 'sine', 0.4);
    this.locked += 1;
    this.youLose = true;
  }
  if (this.revealedCards >= this.cards.length && this.score >= this.cards.length -1) {
    this.locked += 1;
    this.youWin = true;    
  }
};
