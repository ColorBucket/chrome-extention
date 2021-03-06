'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var streamqueue = require('streamqueue');
var clean = require('gulp-clean');
var wait = require('gulp-wait');
 
// Style bundling
var stylesToBundle = [];

gulp.task('bundle-sass', function () {
  var sassStream = gulp.src('./app/styles/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS());
  var vendors = gulp.src(stylesToBundle);

  return streamqueue({ objectMode: true },
      vendors,
      sassStream
    )
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./build'));
});

// JS building
var scriptsToBundle = [
  './node_modules/axios/dist/axios.min.js',
  './app/services/*.js',
  './app/index.js'];

gulp.task('bundle-js', function() {
  return gulp.src(scriptsToBundle)
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./build'));
});

//

gulp.task('copy-statics', function () {
  gulp.src(['./app/index.html', './app/popup.html', './app/popup.js'])
    .pipe(gulp.dest('./build/'));

  return gulp.src(['./app/assets/*.*'])
    .pipe(gulp.dest('./build/assets/'));
});

gulp.task('clean-build', function () {
  return gulp.src('./build/**/*.*', {read: false})
    .pipe(clean())
    .pipe(wait(50));
});

gulp.task('watch-dev', function () {
  gulp.watch('./app/**/*.*', ['default']);
});

///////

gulp.task('default', [/*'clean-build',*/ 'bundle-js', 'bundle-sass', 'copy-statics']);

gulp.task('dev', ['watch-dev']);