/** @constructor */
var FoodPickerScreen = function(game) {
  this.game = game;
  this.food = game.food;
  this.pet = game.pet;
  this.text = game.text;
  this.sound = game.sound;
  this.currentPage = 0;
  this.menu = this.food.getFoodList();
  this.numPages = this.pet.isBaby ? 2 : this.menu.length;
  this.actions = {
    'yes': function() {
      this.manager.closeCurrent();
      if (this.pet.feed(this.menu[this.currentPage])) {
        this.manager.open(new EatScreen(this.game, {foodId: this.currentPage}));
      } else {
        this.manager.open(new EmoteScreen(this.game, {emote: 'refuse'}));
      }
    },
    'no': function() {
      this.manager.closeCurrent();
    },
    'right': function() {
      this.currentPage = Math.mod(this.currentPage + 1, this.numPages);
      this.sound.beep(2000, 3100, 'square', 0.2);
    },
    'left': function() {
      this.currentPage = Math.mod(this.currentPage - 1, this.numPages);
      this.sound.beep(2000, 3100, 'square', 0.2);
    },
  };
};
FoodPickerScreen.prototype.update = function(time) {};
FoodPickerScreen.prototype.render = function(display) {
  display.clearScreen();
  this.food.drawFoodTile(display, this.currentPage, this.game.ticks % 2, 12, 0);
  this.text.drawText(display, 'center', 10, this.menu[this.currentPage].name);
  this.text.drawArrows(display);
  display.outputBuffer();
};