var fs = require('fs');
var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');
var concat = require('gulp-concat');
var del = require('del');
var zip = require('gulp-zip');
var cleanCSS = require('gulp-clean-css');
var imageOptim = require('gulp-imageoptim');
var inline = require('gulp-inline');
var inlineBase64 = require('gulp-inline-base64');
var htmlmin = require('gulp-htmlmin');
var inject = require('gulp-js-base64-inject');

var concatOrder = [
  'src/config.js',
  'src/util.js',
  'src/sound.js',
  'src/graphics.js',
  'src/text.js',
  'src/food.js',
  'src/pet.js',
  'src/printer.js',
  'src/screen-manager.js',
  'src/screens/*.js',
  'src/game.js',      
];

gulp.task('copy:html',function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('build'));
});

gulp.task('copy:png',function() {
  return gulp.src('src/*.png')
    .pipe(gulp.dest('build'));
});
 
gulp.task('inject:images', function() {
    return gulp.src('build/game.js')
        .pipe(inject({ basepath: 'build'}))
        .pipe(gulp.dest('build'));
});

gulp.task('packhtml', function() {
  return gulp.src('build/index.html')
    .pipe(inline())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('zip', function() {
    return gulp.src('dist/index.html')
        .pipe(zip('game.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('concat', function() {
  return gulp.src(concatOrder)
    .pipe(concat('game.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('minify:js', function() {
  return gulp.src('build/game.js')
    .pipe(closureCompiler({
      fileName: 'game.js',
      compilerFlags: {
        language_in: 'ECMASCRIPT6',
        language_out: 'ES5',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        // .call is super important, otherwise Closure Library will not work in strict mode.
        output_wrapper: '(function(){%output%}).call(window);',
        warning_level: 'VERBOSE'
      }
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('minify:css', function() {
  return gulp.src('src/*.css')
    .pipe(inlineBase64({baseDir: 'src/'}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('build'));
});

gulp.task('minify:png', function() {
    return gulp.src('src/*.png*')
      .pipe(imageOptim.optimize())
      .pipe(gulp.dest('build'));
}); 

gulp.task('report', function(done) {
  var stat = fs.statSync('dist/game.zip'),
      limit = 1024 * 13,
      size = stat.size,
      remaining = limit - size,
      percentage = (remaining / limit) * 100;

  percentage = Math.round(percentage * 100) / 100;

  console.log('\n\n-------------');
  console.log('BYTES USED: ' + stat.size);
  console.log('BYTES REMAINING: ' + remaining);
  console.log(percentage + '%');
  console.log('-------------\n\n');
  done();
});

gulp.task('clean:dist', function () {
  return del(['dist/**/*']);
});

gulp.task('clean:build', function () {
  return del(['build/**/*']);
});

gulp.task('build:dev', function() {
  return gulp.src(concatOrder)
    .pipe(concat('game.js'))
    .pipe(inject({ basepath: 'src' }))
    .pipe(gulp.dest('dev'));
});

gulp.task('css:dev', function() {
  return gulp.src('src/*.css')
    .pipe(inlineBase64({baseDir: 'src/'}))
    .pipe(gulp.dest('dev'));
});

gulp.task('copy:dev', function() {
  return gulp.src('src/*.{html}')
    .pipe(gulp.dest('dev'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', gulp.series('build:dev'));
  gulp.watch('src/*.{html}', gulp.series('copy:dev'));
  gulp.watch('src/*.{css}', gulp.series('css:dev'));;
});


gulp.task('clean:all', gulp.parallel('clean:build', 'clean:dist'));
gulp.task('minify', gulp.parallel( gulp.series('concat', 'minify:png', 'inject:images', 'minify:js'), 'minify:css'));
gulp.task('minify:codeonly', gulp.parallel( gulp.series('concat', 'copy:png', 'inject:images', 'minify:js'), 'minify:css'));
gulp.task('build', gulp.series('clean:all', 'minify', 'copy:html', 'packhtml', 'zip', 'clean:build', 'report'));
gulp.task('build:quick', gulp.series('clean:all', 'minify:codeonly', 'copy:html', 'packhtml', 'zip', 'clean:build', 'report'));
