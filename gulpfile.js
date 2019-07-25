const gulp = require('gulp');
// // SCSS
// const sass = require('gulp-sass');
// const autoprefixer = require('gulp-autoprefixer');
// const stripCssComments = require('gulp-strip-css-comments');

// const notify = require('gulp-notify');
const wait = require('gulp-wait');
// const rename = require('gulp-rename');

/**
 * Подключаем конфиг из проекта, если есть
 */
const fs = require('fs');
const fileConfig = 'my-gulp-config.json';
const config = fs.existsSync('../' + fileConfig)
  ? require('../' + fileConfig)
  : require('./' + fileConfig);

/**
 * Обрабатываем файлы JavaScript 
 */
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
config.js.forEach(item => {
  gulp.task(item.name, () => {
    gulp
      .src([item.dev + '/*.js', '!' + item.dev + '/_*.js'])
      .pipe(wait(1500)) // решает проблему долгого чтения исходного файла
      .pipe(
        babel({
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-class-properties'],
        })
      )
      .pipe(
        uglify({
          toplevel: true,
          ie8: true,
        })
      )
      .pipe(gulp.dest(item.out));
  });
});

// /**
//  * SCSS
//  */
// config.scss.forEach(element => {
//   gulp.task(element.name, function() {
//     gulp
//       .src(['../' + element.dev + '/*.scss', '!../' + element.dev + '/_*.scss'])
//       .pipe(wait(1500))
//       .pipe(
//         sass({ outputStyle: 'compressed' }).on(
//           'error',
//           notify.onError({
//             message: '<%= error.message %>',
//             title: element.name + ' - ошибка',
//           })
//         )
//       )
//       .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
//       .pipe(stripCssComments({ preserve: config.comments })) // удаляес все коментарии
//       .pipe(
//         rename(function(path) {
//           // меняем расширение файла
//           if (element.ext !== null && element.ext !== undefined) {
//             path.extname = element.ext;
//           }
//         })
//       )
//       .pipe(gulp.dest(element.out));
//   });
// });

/**
 *	Отслеживаем изменения
 */
gulp.task('default', function() {
  config.js.forEach(item => {
    gulp.watch(item.dev + '/*.js').on('change', gulp.series(item.name));
  });
  // config.scss.forEach(item => {
  //   gulp.watch('../' + item.dev + '/*.scss').on('change', gulp.series(item.name));
  // });
});
