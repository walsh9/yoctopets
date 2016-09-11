/** @constructor */
var ErrorScreen = function(game, params) {
  this.text = game.Text;
  this.message = params.message;
  this.time = parms.duration;
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
  this.text.drawText(display, 'center', 6, this.message);
  display.outputBuffer();
};