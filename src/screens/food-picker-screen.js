/** @constructor */
var FoodPickerScreen = function(game) {
  this.game = game;
  this.food = game.Food;
  this.pet = game.Pet;
  this.text = game.Text;
  this.sound = game.Sound;
  this.currentPage = 0;
  this.menu = this.food.getFoodList();
  this.numPages = this.menu.length;
  this.actions = {
    'yes': function() {
      this.manager.closeCurrent();
      if (this.pet.feed({nutrition: 50, junk:0, flavor: 10})) {
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
    },
    'left': function() {
      this.currentPage = Math.mod(this.currentPage - 1, this.numPages);
    },
  };
};
FoodPickerScreen.prototype.update = function(time) {};
FoodPickerScreen.prototype.render = function(display) {
  display.clearScreen();
  this.food.drawFoodTile(display, this.currentPage, this.game.ticks % 2, 12, 0);
  this.text.drawText(display, 'center', 10, this.menu[this.currentPage]);
  this.text.drawArrows(display);
  display.outputBuffer();
};