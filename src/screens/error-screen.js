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