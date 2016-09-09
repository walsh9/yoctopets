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