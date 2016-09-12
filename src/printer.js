var PRINTER_DOT_SIZE = 2;
var PRINTER_DPD = 4;
var PRINTER_MARGIN = 5;

/** @constructor */
var Printer = function(display, sound, selector) {
  this.display = display;
  this.sound = sound;
  this.ink = 1000;
  this.paperCount = 10;
  this.elem = document.querySelector(selector);
  this.busy = false;
};

Printer.prototype.print = function() {
  if (this.busy) {
    return 'busy';
  }
  if (this.paperCount <= 0) {
    return 'no paper';
  }
  if (this.ink < 0) {
    return 'no ink';
  }
  this.busy = true;
  var rows = this.display.displayBuffer.slice().map(function(row) {
    return row.slice();
  }).reverse();
    var canvas = document.createElement('canvas');
    canvas.width = PRINTER_DOT_SIZE * PRINTER_DPD * rows[0].length + PRINTER_MARGIN * 2;
    canvas.height = PRINTER_DOT_SIZE * PRINTER_DPD * rows.length + PRINTER_MARGIN * 2;
  if (!this.paper) {
    this.paper = document.createElement('div');
    this.paper.classList.add('paper');
    this.paper.width = canvas.width  + 'px';
    this.elem.appendChild(this.paper);
  }
  this.paperCount -= 1;
  this.paper.height += canvas.height + 'px';
  if (parseInt(this.paper.style.top, 10) > 0) {
    this.paper.style.top = parseInt(this.paper.style.top, 10) - canvas.height + 'px';
  };
  this.paper.insertBefore(canvas, this.paper.firstChild);
  var ctx = canvas.getContext('2d');
  var self = this;
  this.printToPage(rows, ctx, this.paper).then(function finished() {
    self.busy = false;
  });
  return 'ok';
};

Printer.prototype.printToPage = function(rows, ctx, paper) {
  var self = this;
  var totalRows = rows.length * PRINTER_DPD;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  return rows.reduce(function(prevPromise, row, y) {
    return prevPromise.then(function() {
      return Math.range(0, PRINTER_DPD - 1).reduce(function(prevPromise, dotRow) {
        return prevPromise.then(function() {
          return self.printRow(ctx, row, totalRows - (y * PRINTER_DPD + dotRow));
        }).then(function() {
          return Graphics.linearTween(self.paper.style, 'top', PRINTER_DOT_SIZE, 50);
        });
      }, Promise.resolve());
    });
  }, Promise.resolve());
};

Printer.prototype.printRow = function(ctx, row, dotY) {
  var self = this;
  return row.reduce(function(prevPromise, pixel, x) {
    return prevPromise.then(function() {
      return Math.range(0, PRINTER_DPD - 1).reduce(function(prevPromise, dot) {
        return prevPromise.then(function() {
          return self.printDot(ctx, x * PRINTER_DPD + dot, dotY, pixel);
        });
      }, Promise.resolve());
    });
  }, Promise.resolve());
};

Printer.prototype.printDot = function(ctx, dotX, dotY, dot) {
  var self = this;
  return new Promise(function(resolve) {
    if (dot) {
      var randomOffset = (Math.random() - 0.5) * PRINTER_DOT_SIZE;
      ctx.fillStyle = 'rgba(0,0,0,'+ self.ink/1000 + ')';
      ctx.beginPath();
      ctx.arc(dotX * PRINTER_DOT_SIZE + randomOffset + PRINTER_MARGIN, dotY * PRINTER_DOT_SIZE + PRINTER_MARGIN, PRINTER_DOT_SIZE, 0, Math.PI*2, true);
      ctx.fill();
      self.ink -= 0.17;
      self.sound.pureBeep(1000, 1000, 'sawtooth', 0.15, 0.025);
      if (dotX % PRINTER_DPD === 0) {
        window.setTimeout(resolve, 15);
      } else {
        resolve();
      }
    } else {
      if (dotX % PRINTER_DPD === 0) {
        window.setTimeout(resolve, 3);
      } else {
        resolve();
      }
    }
  });
};