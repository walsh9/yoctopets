var CANVAS = document.querySelector('canvas');
var CTX = CANVAS.getContext('2d');
var W = CANVAS.width;
var H = CANVAS.height;

Game.Graphics = {};
Game.Graphics.createImgData = function(imageSource) {
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

Game.Graphics.drawPixel = {
  on: function(x, y) {
    CTX.fillStyle = 'rgba(40, 40, 40, 0.85)';
    CTX.shadowOffsetX = 1;
    CTX.shadowOffsetY = 1;
    CTX.shadowBlur =  2;
    CTX.shadowColor = '#888';
    CTX.fillRect(x * DISPLAY_TILE_SIZE + 1, y * DISPLAY_TILE_SIZE + 1, DISPLAY_TILE_SIZE - 1 * 2, DISPLAY_TILE_SIZE - 1 * 2);
  },
  off: function(x, y) { 
    CTX.fillStyle = 'rgba(40, 40, 40, 0.05)';
    CTX.fillRect(x * DISPLAY_TILE_SIZE + 1, y * DISPLAY_TILE_SIZE + 1, DISPLAY_TILE_SIZE - 1 * 2, DISPLAY_TILE_SIZE - 1 * 2);
  }
};

Game.Graphics.drawTile = function(tileData, tileCol, tileRow, screenX, screenY) {
  for (var i = 0; i < tileData.tileWidth * tileData.tileHeight; i++) {
    var xOffset = i % tileData.tileWidth;
    var yOffset = Math.floor(i / tileData.tileWidth);
    var tileX = tileCol * tileData.tileWidth + xOffset;
    var tileY = tileRow * tileData.tileHeight + yOffset;
    var tilePixel = (tileX + tileY * tileData.width) * 4 + 3;
    if (tileData.data[tilePixel]) {
      Game.Graphics.drawPixel.on(screenX + xOffset, screenY + yOffset);
    }
  }
};

Game.Graphics.clearScreen = function() {
  CTX.fillStyle = '#DCF0E6';
  CTX.fillRect(0, 0, W, H);
  for (var x = 0; x < W; x++) {
    for (var y = 0; y < H; y++) {
      Game.Graphics.drawPixel.off(x, y);
    }
  }
};