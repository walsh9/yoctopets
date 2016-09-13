/** @constructor */
function Pet(options) {
  this.tileData = options.tileData;
  this.game = options.game;
  this.sound = options.game.sound;

  this.isBorn = false;
  this.isBaby = false;
  this.isAdult = false;
  this.isAlive = true;
  this.mature = false;

  // form = [head tile row, body tile row] 
  this.x = 9;
  this.dirs = [0,0];
  this.frames = [0, 1];
  this.millisecondsAlive = 0;
  this.name = this.generateName();

  this.bored  = 20;
  this.hungry = 20;
  this.filthy = 20;
  this.health = 100;
  this.happy  = 50;

  this.digested = 0;

  this.filth = 0;
  this.illness = 0;

  this.whining = false;

  return this;
}

Pet.prototype.update = function(time) {
  if (this.isBorn && this.isAlive) {
    this.updateBored(time);
    this.updateHungry(time);
    this.updateFilthy(time);
    this.updateHappy(time);
    this.updateSick(time);
    this.updateAge(time);
    this.updateTimers(time);
    this.setMood();
    this.getAttention();
    this.bounceAround();
  }
};

/* Ambient Behavior */

Pet.prototype.updateBored = function(time) {
  this.bored = Math.max(0, this.bored);
  // from 0 to max in 300 to 500 seconds
  var increment = Math.randomBetween(MAX_STAT/500, MAX_STAT/300) * time/1000;
  this.bored = Math.min(MAX_STAT, this.bored + increment);
};
Pet.prototype.updateHungry = function(time) {
  this.hungry = Math.max(0, this.hungry);
  // from 0 to max in 150 to 300 seconds
  var increment = Math.randomBetween(MAX_STAT/300, MAX_STAT/150) * time/1000;
  this.hungry = Math.min(MAX_STAT, this.hungry + increment);
  this.digested += increment;
  if (this.digested > 70) {
    this.digested = 0;
    this.hungry = Math.min(MAX_STAT, this.hungry + 5);
    this.filth++;
  }
};
Pet.prototype.updateFilthy = function(time) {
  var multiplier = this.filth + 1;
  // from 0 to max in to 200 to 400 secs (0 filth)
  // from 0 to max in to 100 to 200 secs (1 filth)
  // from 0 to max in to 66.6 to 133.3 secs (2 filth)
  var increment = Math.randomBetween(MAX_STAT/400, MAX_STAT/200) * multiplier * time/1000;
  this.filthy = Math.min(MAX_STAT, this.filthy + increment);
};
Pet.prototype.updateHappy = function(time) {
  // from 100 to min in to 200 to 400 secs;
  var decrement = Math.randomBetween(MAX_STAT/400, MAX_STAT/200) * time/1000;
  this.happy = Math.max(0, this.happy - decrement);
};
Pet.prototype.updateSick = function(time) {
  if (this.illness <= 0 && this.hungry < 70 && this.filthy < 70 && this.filth <= 0) {
    // from 0 to max in to 100 to 200 secs;
    var increment = Math.randomBetween(MAX_STAT/200, MAX_STAT/100) * time/1000;
    this.health = Math.min(MAX_STAT, this.health + increment);
  } else {
    var badHealthMultiplier = this.illness + this.filth/2;
    if (this.hungry > 70) {
      badHealthMultiplier += (this.hungry === MAX_STAT) ? 1 : 0.5;
    }
    if (this.filthy > 70 || this.filth > 0) {
      badHealthMultiplier += 0.5;
    }
    // from max to 0 in to 100 to 200 secs (1 badHealth)
    // from max to 0 in to 50 to 100 secs (2 badHealth)
    // from max to 0 in to 33 to 133 secs (3 badHealth)
    var decrement = Math.randomBetween(MAX_STAT/200, MAX_STAT/100) * badHealthMultiplier * time/1000;
    this.health = Math.max(0, this.health - decrement);    
    this.happy = Math.max(0, this.happy - decrement);    
  }
};

Pet.prototype.setMood = function() {
  this.frames = [0,1];
  if (Game.ticks % 13 === 0) {
    if (this.happy > 80) {
      this.frames = [0,7];
    } else if (this.happy < 20) {
      this.frames = [0,5];
    }
  }
  if (this.whining) {
    this.frames = [0, 6];
  }
};

Pet.prototype.getAttention = function() {
  if (this.health - this.ageInYears() < 40 ||
      this.illness > 0 ||
      this.filthy > 70 ||
      this.hungry > 70 ||
      this.bored > 70) {
    this.whining = true;
  } else {
    this.whining = false;
  }


  if (this.whining && Game.ticks % 2 === 0) {
    document.querySelector('#i-7').classList.add('active');
  } else {
    document.querySelector('#i-7').classList.remove('active');
  }
};

Pet.prototype.updateAge = function(time) {
  this.millisecondsAlive += time;
  if (this.isBaby && !this.mature && this.millisecondsAlive > 60 * 1000) {
    this.growUp();
  } 
  if (this.health - this.ageInYears() < 0) {
    this.isAlive = false;
    this.game.screens.open(new DeathScreen(this.game));
  }
  //this.debugStats();
};
Pet.prototype.updateTimers = function(time) {

};

Pet.prototype.bounceAround = function() {
  if (this.x > 10) {
    this.dirs = [0,0];
  }

  if (this.x < 0) {
    this.dirs = [1,1];
  }

  this.x += this.dirs[0] ? 1 : -1;
};

/* Player Interactions */
Pet.prototype.play = function() {
  if (this.bored < 15) {
    return false;
  } else {
    return true;
  }
};

Pet.prototype.wonGame = function() {
  this.bored += -70;
  this.happy += 10;
};

Pet.prototype.lostGame = function() {
  this.bored += -50;
};

Pet.prototype.getBorn = function() {
  this.isBorn = true;
  this.isBaby = true;
  this.form = [Math.randomInt(0,1)];
};
Pet.prototype.growUp = function() {
  this.mature = true;
  var originalForm = this.form[0];
  var newForm = Math.randomInt(1,4) + (originalForm * 4);
  this.game.screens.insert(new EvolveScreen(this.game, {newForm: [newForm, newForm]}), 1);
};

Pet.prototype.feed = function(food) {
  if (this.hungry < (food.nutrition - food.flavor) / 3) {
    return false;
  } else {
    this.happy += food.flavor;
    this.bored -= food.flavor / 2;  
    this.hungry -= food.nutrition;
    this.health -= food.junk;
    return true;
  }
};

Pet.prototype.applyGlitch = function(glitch) {
  switch(glitch) { //nice rhyme
  case 'faster':
    this.sound.beep(500, 800, 'sawtooth', 1); 
    this.sound.beep(800, 500, 'sawtooth', 1);
    this.game.timeStep = Math.max(50, this.game.timeStep * 0.74);
    break;
  case 'morph':
    this.sound.beep(500, 800, 'sawtooth', 1); 
    this.sound.beep(800, 500, 'sawtooth', 1);
    this.form[1] = Math.randomInt(1,8);
    break;
  case 'sound':
    this.sound.freqMutator = Math.randomBetween(0.8, 1.2);
    this.sound.freq2Mutator = Math.randomBetween(0.2, 1.2);
    this.sound.timeMutator = Math.randomBetween(0.5, 1.2);
    this.sound.beep(500, 800, 'sawtooth', 1); 
    this.sound.beep(800, 500, 'sawtooth', 1);
    break;
  case 'graphics':
    this.sound.beep(500, 800, 'sawtooth', 1); 
    this.sound.beep(800, 500, 'sawtooth', 1);
    var glitchBitCount = this.game.display.glitchBits.length;
    var randomGlitchBit = Math.randomInt(0, glitchBitCount - 1);
    this.game.display.glitchBits[randomGlitchBit] = !this.game.display.glitchBits[randomGlitchBit];
    break;
  case 'life':
    this.sound.beep(500, 800, 'sawtooth', 1); 
    this.sound.beep(800, 500, 'sawtooth', 1);
    this.game.display.lifeGlitch = Math.min(5, this.game.display.lifeGlitch + 1);
    break;
  }
};

Pet.prototype.clean = function() {
  if (this.filth === 0 && this.filthy < 50) {
    return false;
  } else {
    this.happy += 20;
    this.filthy = 0;
    this.filth = 0;
    return true;
  }
};

Pet.prototype.medicate = function() {
  if (this.illness === 0 && this.health === 100) {
    return false;
  } else {
    if (this.illness > 0) {
      this.happy += 10;
    } else {
      this.happy -= 10;
    }
    this.health = 100;
    this.illness = 0;
    return true;
  }
};

Pet.prototype.whine = function() {
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
  console.log('HEALTH: ', parseInt(this.health, 10));
  console.log('HAPPY:  ', parseInt(this.happy, 10));
  console.log('WHINING:', this.whining, this.whineCooldown);
};

Pet.prototype.render = function(display) {
  var currentFrame = Game.ticks % 2 ? this.frames[0] : this.frames[1];
  if (this.isBaby) {
    this._drawPetTile(display, this.x, this.tileData.tileHeight, currentFrame, this.form[0], this.dirs[0]);
  } else {
    this._drawPetTile(display, this.x, 0, currentFrame, this.form[0] * 2, this.dirs[0]);
    this._drawPetTile(display, this.x, this.tileData.tileHeight, currentFrame, this.form[1] * 2 + 1, this.dirs[1]);
  }
};

Pet.prototype.renderStatus = function(display) {
  if (this.filth) {
    display.drawTile(Game.icons, Game.ticks % 2, 1, 24, 8);
  }
  if (this.illness || this.health - this.ageInYears() < 40) {
    display.drawTile(Game.icons, Game.ticks % 2, 0, 24, 0);
  }
};

Pet.prototype.ageInYears = function() {
  return Math.floor(this.millisecondsAlive/1000/30);
};

Pet.prototype.generateName = function() {
  var starts = ['fi','ro','re','di','bo','pe','mo','be','li','mu','po','to','ra','sa','za'];
  var ends = ['do','ver','x','ngo','sh','tsi','kta','lla','zza','tt','lly','to','ra','sa','za'];
  return starts[Math.randomInt(0,starts.length - 1)] + ends[Math.randomInt(0,ends.length - 1)];
};

/** @private */
Pet.prototype._drawPetTile = function(display, x, y, column, row, reversed) {
  display.drawTile(this.tileData, column, row, x, y, reversed);
};
