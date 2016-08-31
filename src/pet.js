/** @constructor */
function Pet(options) {
  this.tileData = options.tileData;
  this.sound = options.sound;
  // form = [head tile row, body tile row] 
  this.form = [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
  this.x = 9;
  this.mood = 0;
  this.millisecondsAlive = 0;

  this.bored  = 0;
  this.hungry = 0;
  this.filthy = 0;
  this.sick   = 0;

  this.boredRate  = 5;
  this.hungryRate = 5;
  this.filthyRate = 5;

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
  this.hungry += this.hungryRate * 0.001 * time;
  this.filthy += this.filthyRate * 0.001 * time;

  this.whineCooldown -= 0.001 * time;

  if (this.filthy > 60) {
    this.sick += this.filthy * 0.0001 * time;
  }

  if (this.hungry > 75) {
    this.sick += this.hungry * 0.00005 * time;
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

  this.x += Math.random() > 0.5 ? 1 : -1;
  this.mood = this.mood ? 0 : 1;
};

Pet.prototype.feed = function(food) {
  pet.hungry -= food.nutrition;
  pet.sick += food.junk;
};

Pet.prototype.whine = function() {
  console.log('WAA');
  this.whining = true;
};

Pet.prototype.stopWhining = function() {
  this.whining = false;
  this.whineCooldown = 10;
};


Pet.prototype.debugStats = function() {
  console.log('BORED:  ', parseInt(this.bored));
  console.log('HUNGRY: ', parseInt(this.hungry));
  console.log('FILTHY: ', parseInt(this.filthy));
  console.log('SICK:   ', parseInt(this.sick));
  console.log('WHINING:', this.whining, this.whineCooldown);
};

Pet.prototype.render = function(display) {
  this._drawPetTile(display, this.x, 0, this.mood, this.form[0] * 2);
  this._drawPetTile(display, this.x, this.tileData.tileHeight, this.mood, this.form[1] * 2 + 1);
};

/** @private */
Pet.prototype._drawPetTile = function(display, x, y, column, row) {
  display.drawTile(this.tileData, column, row, x, y);
};
