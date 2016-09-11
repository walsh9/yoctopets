/** @constructor */
var PixelDisplay = function(canvas, pixelSize) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.w = canvas.width;
  this.h = canvas.height;
  this.pixelSize = pixelSize;
  this.pixelWidth = Math.floor(this.w / pixelSize);
  this.pixelHeight = Math.floor(this.h / pixelSize);
  this.displayBuffer = [];
  for(var y = 0; y < this.pixelHeight; y++) {
    this.displayBuffer[y] = [];
  }
  this.clearScreen();
};


PixelDisplay.prototype.bufferPixel = function(x, y, on) {
  if (x >= 0 && x < this.pixelWidth && y >=0 && y < this.pixelHeight) {
    this.displayBuffer[y][x] = on;
  }
};

PixelDisplay.prototype.outputBuffer = function () {
  var self = this;
  this.displayBuffer.forEach(function(row, y) {
    row.forEach(function(pixel, x) {
      self.drawPixel(x, y, self.displayBuffer[y][x]);
    });
  });
};

PixelDisplay.prototype.drawPixel = function (x, y, on){
  if (x < 0 || x >= this.pixelWidth || y < 0 || y >= this.pixelHeight) {
    return;
  }
  if (on) {
    this.ctx.fillStyle = '#DCF0E6';
    this.ctx.shadowColor = 'transparent';
    this.ctx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
    this.ctx.fillStyle = 'rgba(40, 40, 40, 0.85)';
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
    this.ctx.shadowBlur =  2;
    this.ctx.shadowColor = '#888';
    this.ctx.fillRect(x * this.pixelSize + 1, y * this.pixelSize + 1, this.pixelSize - 1 * 2, this.pixelSize - 1 * 2);
  } else {
    this.ctx.fillStyle = '#DCF0E6';
    this.ctx.shadowColor = 'transparent';
    this.ctx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
    this.ctx.fillStyle = 'rgba(40, 40, 40, 0.05)';
    this.ctx.fillRect(x * this.pixelSize + 1, y * this.pixelSize + 1, this.pixelSize - 1 * 2, this.pixelSize - 1 * 2);
  }
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
      this.bufferPixel(screenX + xOffset, screenY + yOffset, 1);
    }
  }
};

PixelDisplay.prototype.drawVerticalLine = function(x, y0, length, on) {
  for (var y = y0; y < y0 + length; y++) {
    this.bufferPixel(x, y, on);
  }
};

PixelDisplay.prototype.drawHorizontalLine = function(x0, y, length, on) {
  for (var x = x0; x < x0 + length; x++) {
    this.bufferPixel(x, y, on);
  }
};

PixelDisplay.prototype.clearScreen = function() {
  this.ctx.fillStyle = '#DCF0E6';
  this.ctx.fillRect(0, 0, this.w, this.h);
  for (var x = 0; x < this.w; x++) {
    for (var y = 0; y < this.h; y++) {
      this.bufferPixel(x, y, 0);
    }
  }
};
