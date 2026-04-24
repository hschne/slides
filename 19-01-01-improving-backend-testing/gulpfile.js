var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', gulp.series(() => {

  // reveal.js, remove a bunch of useless stuff
  gulp.src([
      './node_modules/reveal.js/**/*',
      '!./node_modules/reveal.js/.*',
      '!./node_modules/reveal.js/*.js',
      '!./node_modules/reveal.js/**/*.{txt,json,md,scss}',
      '!./node_modules/reveal.js/**/LICENSE',
      '!./node_modules/reveal.js/test/',
      '!./node_modules/reveal.js/test/**/*',
    ])
    .pipe(gulp.dest('./vendor/reveal.js'))
}));

gulp.task('css:compile', gulp.series(() => {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
}));

// Minify CSS
gulp.task('css:minify', gulp.series('css:compile', () => {
  return gulp.src([
      './css/*.css',
      '!./css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
}));

// CSS
gulp.task('css', gulp.series('css:compile', 'css:minify'));

gulp.task('js:minify', gulp.series(() => {
  return gulp.src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
}));

// JS
gulp.task('js', gulp.series('js:minify'));

// Browser Sync
gulp.task('browserSync', gulp.series(() =>{
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
}));

// Default
gulp.task('default', gulp.series('css', 'js', 'vendor'));

// DEV
gulp.task('dev', gulp.parallel('css', 'js', 'browserSync', () => {
  gulp.watch('./scss/**/*.scss', gulp.series('css'));
  gulp.watch('./js/*.js', gulp.series('js'));
  gulp.watch('./*.html', browserSync.reload);
}));
