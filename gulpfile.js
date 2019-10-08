const gulp = require('gulp');
const wait = require('gulp-wait');
const notify = require('gulp-notify');
const rename = require('gulp-rename');

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Подключаем конфиг из проекта, если есть ~~~ */
const { existsSync } = require('fs');
const fileConfig = 'my-gulp-config.json';
const config = existsSync('../' + fileConfig) ? require('../' + fileConfig) : require('./' + fileConfig);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Обрабатываем файлы JavaScript ~~~ */
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
config.js.forEach(item => {
    gulp.task(item.name, () => {
        gulp.src([item.dev + '/*.js', '!' + item.dev + '/_*.js'])
            .pipe(wait(1500)) // решает проблему долгого чтения исходного файла
            .pipe(
                babel({
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-proposal-class-properties'],
                }).on(
                    'error',
                    notify.onError({
                        message: '<%= error.message %>',
                        title: item.name + ' - ошибка',
                    })
                )
            )
            .pipe(
                uglify({
                    toplevel: true,
                    ie8: true,
                })
            )
            .pipe(
                rename({
                    prefix: item.prefix,
                    suffix: item.suffix,
                    extname: item.extname,
                })
            )
            .pipe(gulp.dest(item.out));
    });
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Обрабатываем файлы SCSS  ~~~ */
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const stripCssComments = require('gulp-strip-css-comments');
config.scss.forEach(item => {
    gulp.task(item.name, function() {
        gulp.src([item.dev + '/*.scss', '!' + item.dev + '/_*.scss'])
            .pipe(wait(1500))
            .pipe(
                sass({ outputStyle: 'compressed' }).on(
                    'error',
                    notify.onError({
                        message: '<%= error.message %>',
                        title: item.name + ' - ошибка',
                    })
                )
            )
            .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'], cascade: false }))
            .pipe(stripCssComments({ preserve: item.comments })) // удаляем все коментарии
            .pipe(
                rename({
                    prefix: item.prefix,
                    suffix: item.suffix,
                    extname: item.extname,
                })
            )
            .pipe(gulp.dest(item.out));
    });
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Отслеживаем изменения  ~~~ */
gulp.task('default', function() {
    config.js.forEach(item => gulp.watch(item.dev + '/*.js').on('change', gulp.series(item.name)));
    config.scss.forEach(item => gulp.watch(item.dev + '/*.scss').on('change', gulp.series(item.name)));
});
