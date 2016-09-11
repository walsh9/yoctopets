var Graphics = {};
Graphics.linearTween = function(object, property, delta, duration) {
  return new Promise(function(resolve) {
    var startTime = Date.now();
    var startValue = parseInt(object[property], 10) || 0;
    var newValue = startValue + delta;
    function animate() {
      var changeFactor = Math.min(1, (Date.now() - startTime) / duration);
      var nextValue = startValue + delta * changeFactor;
      object[property] = nextValue + 'px';
      if (changeFactor === 1) {
        resolve();
      } else {
        requestAnimationFrame(animate);
      }
    }
    animate();
  });
};


Graphics.initTiles = function(imageData, width, height) {
  var tiles = imageData;
  tiles.tileWidth = width;
  tiles.tileHeight = height;
  return tiles;
};

Graphics.createImgData = function(imageSource) {
  return new Promise(function(resolve) {
    var imageElement = document.createElement('img');
    imageElement.onload = function(event) {
      var image = event.target;
      var canvas = document.createElement('canvas');
      var width = image.width;
      var height = image.height;
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, width, height);
      var imageData = ctx.getImageData(0, 0, width, height);
      resolve(imageData);
    };
    imageElement.src = 'data:' + imageSource;
  });
};
