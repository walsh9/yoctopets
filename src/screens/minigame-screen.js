 /** @constructor */
var MiniGameScreen = function(game) {
  this.game = game;
  this.sound = game.sound;
  this.text = game.text;
  this.pet = game.pet;
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
MiniGameScreen.prototype.update = function(time) {
  if (this.locked > 0) {
    this.locked--;
  } else {
    if (this.youLose) {
      this.manager.closeCurrent();
      this.manager.open(new EmoteScreen(this.game, {emote: 'disapprove'}));
      this.pet.lostGame();
    } else if (this.youWin) {
      this.manager.closeCurrent();
      this.manager.open(new EmoteScreen(this.game, {emote: 'approve'}));
      this.pet.wonGame();
    }
  }
};
MiniGameScreen.prototype.render = function(display) { 
  var petFrame = Game.ticks % 2;
  display.clearScreen();
  display.drawTile(this.pet.tileData, petFrame, this.pet.form[0] * (this.pet.isBaby ? 1 : 2), 16, 0);
  display.drawVerticalLine(14, 8, 8, true);
  display.drawHorizontalLine(14, 8, 18, true);
  this.renderCard(display, 0, 0, 0);
  this.renderCard(display, 1, 7, 0);
  this.renderCard(display, 2, 0, 8);
  this.renderCard(display, 3, 7, 8);
  this.text.drawText(display, 16, 10, this.selection);
  display.outputBuffer();
};
MiniGameScreen.prototype.toggleSelection = function() {
  if (this.selection === '<hi>') {
    this.selection = '<lo>';
  } else {
    this.selection = '<hi>';
  }
  this.sound.beep(2000, 3100, 'square', 0.2);
};
MiniGameScreen.prototype.renderCard = function(display, cardIndex, x, y) {
  if (cardIndex < this.revealedCards) {
    display.drawTile(Game.icons, 1, 6, x, y);
    this.text.drawText(display, x + 2, y + 2, this.cards[cardIndex]);
  } else {
    display.drawTile(Game.icons, 0, 6, x, y);
  }
};
MiniGameScreen.prototype.getCardValue = function(card) {
  return this.deck.indexOf(card);
};
MiniGameScreen.prototype.revealCard = function(selection) {
  this.locked = 2;
  this.revealedCards++;
  var newCard = this.getCardValue(this.cards[this.revealedCards - 1]);
  var oldCard = this.getCardValue(this.cards[this.revealedCards - 2]);
  if ((this.selection === '<hi>' && newCard > oldCard) ||
      (this.selection === '<lo>' && newCard < oldCard)) {
    this.score++;
    this.sound.beep(1500, 1500, 'sine', 0.4);
  } else {
    this.sound.beep(300, 300, 'sine', 0.4);
    this.locked += 1;
    this.youLose = true;
  }
  if (this.revealedCards >= this.cards.length && this.score >= this.cards.length -1) {
    this.locked += 1;
    this.youWin = true;    
  }
};