Math.mod = function(x, y) {
  return ((x % y) + y) % y;
};

Math.range = function(min, max) {
  var array = [];
  for(var i = min; i <= max; i++) {
    array.push(i);
  }
  return array;
};

Math.randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Math.randomBetween = function(min, max) {
  return Math.random() * (max - min + 1) + min;
};