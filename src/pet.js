/** @constructor */
function Pet(options) {
  this.tileData = options.tileData;
  this.sound = options.sound;
  // form = [head tile row, body tile row] 
  var baseForm = Math.floor(Math.random() * 8);
  this.form = [baseForm, baseForm];
  this.x = 9;
  this.frames = [0,1];
  this.dirs = [0,0];
  this.mood = 0;
  this.millisecondsAlive = 0;
  this.weight = 0.5;

  this.bored  = 0;
  this.hungry = 0;
  this.filthy = 0;
  this.sick   = 0;
  this.happy  = 0;

  this.digested = 0;
  this.filth = 0;
  this.ill = 0;

  this.boredRate  = 2;
  this.hungryRate = 2;
  this.filthyRate = 2;

  this.boredTolerance  = 50;
  this.hungryTolerance = 50;
  this.filthyTolerance = 50;
  this.sickTolerance   = 50;

  this.whining = false;
  this.whineCooldown = 0;

  return this;
}

Pet.prototype.update = function(time) {
  this.millisecondsAlive += time;

  this.bored  += this.boredRate  * 0.001 * time;

  if (this.hungry < 100) {
    this.hungry += this.hungryRate * 0.001 * time;
    this.digested += this.hungryRate * 0.001 * time;
  }

  // Hunger becomes digested and creates filth tokens;
  if (this.digested > 50) {
    this.digested = 0;
    this.hungry += 5;
    this.filth++;
  }

  this.filthy += this.filthyRate * 0.001 * time * (this.filth * 5 + 1);

  this.whineCooldown -= 0.001 * time;

  if (this.filthy > 60) {
    this.sick += this.filthy * 0.0001 * time;
  }

  if (this.hungry > 75) {
    this.sick += this.hungry * 0.00005 * time;
  }

  // Sickness becomes an illness token;
  if (this.sick > this.sickTolerance * 1.5) {
    this.happy += -50;
    this.sick = 0;
    this.ill++;
  }

  if  (!this.whining && this.whineCooldown < 0) {
    if (this.bored > this.boredTolerance) {
      this.whine();
    }

    if (this.hungry > this.hungryTolerance) {
      this.whine();
    } 

    if (this.filthy > this.filthyTolerance) {
      this.whine();
    } 

    if (this.sick > this.sickTolerance) {
      this.whine();
    } 
  }

  if (this.x > 10) {
    this.dirs = [0,0];
  }

  if (this.x < 0) {
    this.dirs = [1,1];
  }

  this.x += this.dirs[0] ? 1 : -1;
  this.mood = this.mood ? 0 : 1;
};

Pet.prototype.play = function() {
  if (this.bored < 25) {
    return false;
  } else {
    return true;
  }
};

Pet.prototype.wonGame = function() {
  this.bored += -30;
  this.happiness += 10;
};

Pet.prototype.lostGame = function() {
  this.bored += -20;
};


Pet.prototype.feed = function(food) {
  if (this.hungry < food.nutrition / 2) {
    return false;
  } else {
    this.happy += food.tastiness;    
    this.hungry += -food.nutrition;
    this.sick += food.junk;
    return true;
  }
};

Pet.prototype.clean = function() {
  if (this.filth === 0) {
    return false;
  } else {
    this.happy += 20;
    this.filthy = 0;
    this.filth = 0;
    return true;
  }
};

Pet.prototype.medicate = function() {
  if (this.ill === 0) {
    return false;
  } else {
    this.happy += 20;
    this.sick = 0;
    this.ill = 0;
    return true;
  }
};

Pet.prototype.whine = function() {
  console.log('WAA');
  this.frames = [0, 6];
  this.whining = true;
};

Pet.prototype.stopWhining = function() {
  this.whining = false;
  this.frames = [0, 1];
  this.whineCooldown = 10;
};

Pet.prototype.debugStats = function() {
  console.log('BORED:  ', parseInt(this.bored, 10));
  console.log('HUNGRY: ', parseInt(this.hungry, 10));
  console.log('FILTHY: ', parseInt(this.filthy, 10));
  console.log('SICK:   ', parseInt(this.sick, 10));
  console.log('WHINING:', this.whining, this.whineCooldown);
};

Pet.prototype.render = function(display) {
  var currentFrame = Game.ticks % 2 ? this.frames[0] : this.frames[1];
  this._drawPetTile(display, this.x, 0, currentFrame, this.form[0] * 2, this.dirs[0]);
  this._drawPetTile(display, this.x, this.tileData.tileHeight, currentFrame, this.form[1] * 2 + 1, this.dirs[1]);
};

Pet.prototype.renderStatus = function(display) {
  if (this.filth) {
    display.drawTile(Game.icons, Game.ticks % 2, 1, 24, 8);
  }
  if (this.ill) {
    display.drawTile(Game.icons, Game.ticks % 2, 0, 24, 0);
  }
};

/** @private */
Pet.prototype._drawPetTile = function(display, x, y, column, row, reversed) {
  display.drawTile(this.tileData, column, row, x, y, reversed);
};
