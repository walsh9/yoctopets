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

var FOOD_MENU = [
  {name:'fruit',  nutrition: 60, flavor: 10, junk:  0},
  {name:'candy',  nutrition: 40, flavor: 30, junk: 10},
  {name:'dr1nk',  nutrition: 20, flavor: 20, junk: 10, glitch: 'sound'}, 
  {name:'t3a',    nutrition: 40, flavor: 20, junk:  0, glitch: 'faster'},
  {name:'pud1ng', nutrition: 50, flavor: 60, junk: 20, glitch: 'morph'},
  {name:'d0nut',  nutrition: 50, flavor: 30, junk: 10, glitch: 'graphics'}, 
  {name:'pi22a',  nutrition: 70, flavor: 50, junk: 20, glitch: 'life'}, 
]; 

var ICON_TILE_DATA = '@@import status.png';
var ICON_TILE_WIDTH = 8;
var ICON_TILE_HEIGHT = 8;

var MAX_STAT = 100;

var C4 = 263;
var B3 = 247;
var A3 = 220;
var G3 = 196;
var REST = 0;
/* shout out to Frédéric Chopin */
var CHOPINS_FUNERAL_MARCH = [
  {frequency: A3, duration: 1/4},
  {frequency: A3, duration: 1/8 + 1/16},
  {frequency: A3, duration: 1/16},
  {frequency: A3, duration: 1/4},
  {frequency: C4, duration: 1/8 + 1/16},
  {frequency: B3, duration: 1/16},
  {frequency: B3, duration: 1/8 + 1/16},
  {frequency: A3, duration: 1/16},
  {frequency: A3, duration: 1/8 + 1/16},
  {frequency: A3, duration: 1/16},
  {frequency: A3, duration: 1/2},
];

var SHAVE_AND_A_HAIRCUT = [
  {frequency: C4, duration: 1/4},
  {frequency: G3, duration: 1/8},
  {frequency: G3, duration: 1/8},
  {frequency: A3, duration: 1/4},
  {frequency: G3, duration: 1/4},
  {frequency: REST, duration: 1/4},
  {frequency: B3, duration: 1/4},
  {frequency: C4, duration: 1/4},
];