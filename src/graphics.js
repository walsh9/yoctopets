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

/** @constructor */
var PixelDisplay = function(canvas, pixelSize) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.w = canvas.width;
  this.h = canvas.height;
  this.pixelSize = pixelSize;
  this.pixelWidth = Math.floor(this.w / pixelSize);
  this.pixelHeight = Math.floor(this.h / pixelSize);
  this.printableData = [];
  for(var y = 0; y < this.pixelHeight; y++) {
    this.printableData[y] = [];
  }
  this.clearScreen();
};

PixelDisplay.prototype.drawPixel = function (x, y, on){
  if (x < 0 || x >= this.pixelWidth || y < 0 || y >= this.pixelHeight) {
    return;
  }
  if (on) {
    this.ctx.fillStyle = 'rgba(40, 40, 40, 0.85)';
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
    this.ctx.shadowBlur =  2;
    this.ctx.shadowColor = '#888';
    this.ctx.fillRect(x * this.pixelSize + 1, y * this.pixelSize + 1, this.pixelSize - 1 * 2, this.pixelSize - 1 * 2);
  } else {
    this.ctx.fillStyle = 'rgba(40, 40, 40, 0.05)';
    this.ctx.fillRect(x * this.pixelSize + 1, y * this.pixelSize + 1, this.pixelSize - 1 * 2, this.pixelSize - 1 * 2);
  }
  this.printableData[y][x] = on;
};

PixelDisplay.prototype.drawTile = function(tileData, tileCol, tileRow, screenX, screenY, reversed) {
  for (var i = 0; i < tileData.tileWidth * tileData.tileHeight; i++) {
    var xOffset = i % tileData.tileWidth;
    var tileXOffset = xOffset;
    if (reversed > 0) {
      tileXOffset = tileData.tileWidth - xOffset - 1;
    }
    var yOffset = Math.floor(i / tileData.tileWidth);
    var tileX = tileCol * tileData.tileWidth + tileXOffset;
    var tileY = tileRow * tileData.tileHeight + yOffset;
    var tilePixel = (tileX + tileY * tileData.width) * 4 + 3;
    if (tileData.data[tilePixel]) {
      this.drawPixel(screenX + xOffset, screenY + yOffset, 1);
    }
  }
};

PixelDisplay.prototype.drawVerticalLine = function(x, y0, length) {
  for (var y = y0; y < y0 + length; y++) {
    this.drawPixel(x, y, true);
  }
};

PixelDisplay.prototype.drawHorizontalLine = function(x0, y, length) {
  for (var x = x0; x < x0 + length; x++) {
    this.drawPixel(x, y, true);
  }
};

PixelDisplay.prototype.clearScreen = function() {
  this.ctx.fillStyle = '#DCF0E6';
  this.ctx.fillRect(0, 0, this.w, this.h);
  for (var x = 0; x < this.w; x++) {
    for (var y = 0; y < this.h; y++) {
      this.drawPixel(x, y, 0);
    }
  }
};