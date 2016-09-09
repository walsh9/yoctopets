var Game = {};

var CANVAS = document.querySelector('canvas');
var PIXEL_SIZE = 10;

//all this @@import stuff is replaced with 
// base64 encoded pngs using gulp-js-base64-inject
var PET_TILE_DATA = '@@import data.png';
var PET_TILE_WIDTH = 16;
var PET_TILE_HEIGHT = 8;

var FONT_TILE_DATA = '@@import font.png';
var FONT_TILE_WIDTH = 3;
var FONT_TILE_HEIGHT = 5;

var FOOD_TILE_DATA = '@@import food.png';
var FOOD_TILE_WIDTH = 8;
var FOOD_TILE_HEIGHT = 8;

var FOOD_MENU = ['fruit', 'candy', 't3a', 'd0nut', 'pi22a', 'dr1nk', 'pud1ng'];

var ICON_TILE_DATA = '@@import status.png';
var ICON_TILE_WIDTH = 8;
var ICON_TILE_HEIGHT = 8;