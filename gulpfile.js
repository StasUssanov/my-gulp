const gulp = require('gulp');
const sass = require('gulp-sass'); /* SCSS */
const autoprefixer = require('gulp-autoprefixer'); /* Prefix CSS */
const babel = require('gulp-babel');
const uglify = require('gulp-uglify'); /* JavaScript */
const notify = require('gulp-notify'); /* Оповещалка */
const rename = require('gulp-rename'); /* Переименовалка */

/**
 * SCSS
 */
gulp.task('sass', function() {
  gulp
    .src(['../__scss/*.scss', '!../__scss/_*.scss'])
    /* Отлавливаем ошибки и сжимаем */
    .pipe(
      sass({ outputStyle: 'compressed' }).on(
        'error',
        notify.onError({
          message: '<%= error.message %>',
          title: 'scss - ошибка'
        })
      )
    )
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false })) /* Добовляем префиксы */
    .pipe(gulp.dest('../public/css')); /* Сохраняем */
});

/**
 * JS
 */
gulp.task('js', function() {
  gulp
    .src('../__js/*.js')
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
    .pipe(gulp.dest('../public/scripts'));
});

/**
 * Vue
 */
gulp.task('Vue', function() {
  gulp
    .src('../__js/*.vue')
    .pipe(
      uglify({
        toplevel: true,
        ie8: true
      })
    )
    .pipe(
      rename(function(path) {
        path.basename += '-vue';
        path.extname = '.js';
      })
    )
    .pipe(gulp.dest('../public/scripts'));
});

/**
 *	Отслеживаем изменения
 */
gulp.task('default', function() {
  gulp.watch('../__scss/*.scss').on('change', gulp.series('sass'));
  gulp.watch('../__js/*.js').on('change', gulp.series('js'));
  gulp.watch('../__js/*.vue').on('change', gulp.series('Vue'));
});
