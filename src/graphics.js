var CreateImgData = function(imageSource) {
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
};

PixelDisplay.prototype.drawPixel = {
  on: function(x, y) {
    this.ctx.fillStyle = 'rgba(40, 40, 40, 0.85)';
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
    this.ctx.shadowBlur =  2;
    this.ctx.shadowColor = '#888';
    this.ctx.fillRect(x * this.pixelSize + 1, y * this.pixelSize + 1, this.pixelSize - 1 * 2, this.pixelSize - 1 * 2);
  },
  off: function(x, y) { 
    this.ctx.fillStyle = 'rgba(40, 40, 40, 0.05)';
    this.ctx.fillRect(x * this.pixelSize + 1, y * this.pixelSize + 1, this.pixelSize - 1 * 2, this.pixelSize - 1 * 2);
  }
};

PixelDisplay.prototype.drawTile = function(tileData, tileCol, tileRow, screenX, screenY) {
  for (var i = 0; i < tileData.tileWidth * tileData.tileHeight; i++) {
    var xOffset = i % tileData.tileWidth;
    var yOffset = Math.floor(i / tileData.tileWidth);
    var tileX = tileCol * tileData.tileWidth + xOffset;
    var tileY = tileRow * tileData.tileHeight + yOffset;
    var tilePixel = (tileX + tileY * tileData.width) * 4 + 3;
    if (tileData.data[tilePixel]) {
      this.drawPixel.on(screenX + xOffset, screenY + yOffset);
    }
  }
};

PixelDisplay.prototype.clearScreen = function() {
  this.ctx.fillStyle = '#DCF0E6';
  this.ctx.fillRect(0, 0, this.w, this.h);
  for (var x = 0; x < this.w; x++) {
    for (var y = 0; y < this.h; y++) {
      this.drawPixel.off(x, y);
    }
  }
};