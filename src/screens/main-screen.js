/** @constructor */
var MainScreen = function(game) {
  this.game = game;
  this.sound = game.Sound;
  this.printer = game.Printer;
  this.pet = game.Pet;
  this.selectedIcon = 0;
  this.actions = {
    'switchIn': function() {
      this.pet.x = 8;
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
        this.manager.open(new FoodPickerScreen(this.game));
        break;
      case 1:
        if (this.pet.clean()) {
          this.manager.open(new EmoteScreen(this.game, {emote: 'approve', duration: 6}));
          this.manager.open(new HorizontalWipe(this.game));
        } else {
          this.manager.open(new EmoteScreen(this.game, {emote:'refuse'}));
        }
        break;
      case 2:
        if (this.pet.play()) {
          this.manager.open(new MiniGameScreen(this.game));
        } else {
          this.manager.open(new EmoteScreen(this.game, {emote: 'refuse'}));
        }
        break;
      case 3:
        if (this.pet.medicate()) {
          this.manager.open(new EmoteScreen(this.game, {emote: 'approve', duration: 6}));
          this.manager.open(new VerticalWipe());          
        } else {
          this.manager.open(new EmoteScreen(this.game, {emote: 'refuse'}));
        }
        break;
      case 4:
        this.manager.open(new StatScreen(this.game));
        break;
      case 5:
        this.manager.open(new ClockScreen(this.game));
        break;
      case 6:
        var printStatus = this.printer.print();
        if (printStatus !== 'ok') {
          this.manager.open(new ErrorScreen(this.game, {message: printStatus, duration: 3000}));
        }
        break;
      }
    }
  };
};
MainScreen.prototype.render = function(display) {
  display.clearScreen();
  this.pet.render(display);  
  this.pet.renderStatus(display);
  display.outputBuffer();
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