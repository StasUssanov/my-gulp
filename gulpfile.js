const gulp = require('gulp');
// SCSS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const stripCssComments = require('gulp-strip-css-comments');
// JS
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
//
const notify = require('gulp-notify');
const wait = require('gulp-wait');
const rename = require('gulp-rename');
const fileExists = require('file-exists');

// Подключаем конфиг из проекта, если есть
const config = fileExists.sync('../my-gulp-config.json')
  ? require('../my-gulp-config.json')
  : require('./my-gulp-config.json');

/**
 * SCSS
 */
config.scss.forEach(element => {
  gulp.task(element.name, function() {
    gulp
      .src(['../' + element.dev + '/*.scss', '!../' + element.dev + '/_*.scss'])
      .pipe(wait(1500))
      .pipe(
        sass({ outputStyle: 'compressed' }).on(
          'error',
          notify.onError({
            message: '<%= error.message %>',
            title: element.name + ' - ошибка'
          })
        )
      )
      .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
      .pipe(stripCssComments({ preserve: config.comments })) // удаляес все коментарии
      .pipe(gulp.dest(element.out));
  });
});

/**
 * JS
 */
config.js.forEach(element => {
  gulp.task(element.name, function() {
    gulp
      .src(['../' + element.dev + '/*.js', '!../' + element.dev + '/_*.js'])
      .pipe(wait(1500))
      .pipe(
        babel({
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-class-properties']
        })
      )
      .pipe(
        uglify({
          toplevel: true,
          ie8: true
        })
      )
      .pipe(gulp.dest(element.out));
  });
});

/**
 *	Отслеживаем изменения
 */
gulp.task('default', function() {
  config.js.forEach(element => {
    gulp.watch('../' + element.dev + '/*.js').on('change', gulp.series(element.name));
  });
  config.scss.forEach(element => {
    gulp.watch('../' + element.dev + '/*.scss').on('change', gulp.series(element.name));
  });
});
