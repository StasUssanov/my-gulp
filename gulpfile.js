const gulp = require("gulp");
const sass = require("gulp-sass"); /* SCSS */
const autoprefixer = require("gulp-autoprefixer"); /* Prefix CSS */
const babel = require("gulp-babel");
const uglify = require("gulp-uglify"); /* JavaScript */
const notify = require("gulp-notify"); /* Оповещалка */
const rename = require("gulp-rename"); /* Переименовалка */

const jsPath = [{ name: "js", dev: "__js", out: "../public/scripts" }];
const scssPath = [{ name: "scss", dev: "__scss", out: "../public/css" }];

/**
 * SCSS
 */
scssPath.forEach(element => {
    gulp.task(element.name, function() {
        gulp.src([
            "../" + element.dev + "/*.scss",
            "!../" + element.dev + "/_*.scss"
        ])
            /* Отлавливаем ошибки и сжимаем */
            .pipe(
                sass({ outputStyle: "compressed" }).on(
                    "error",
                    notify.onError({
                        message: "<%= error.message %>",
                        title: element.name + " - ошибка"
                    })
                )
            )
            .pipe(
                autoprefixer({ browsers: ["last 2 versions"], cascade: false })
            ) /* Добовляем префиксы */
            .pipe(gulp.dest(element.out)); /* Сохраняем */
    });
});

/**
 * JS
 */
jsPath.forEach(element => {
    gulp.task(element.name, function() {
        gulp.src([
            "../" + element.dev + "/*.js",
            "!../" + element.dev + "/_*.js"
        ])
            .pipe(
                babel({
                    presets: ["@babel/preset-env"],
                    plugins: ["@babel/plugin-proposal-class-properties"]
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
 * Vue
 */
gulp.task("Vue", function() {
    gulp.src("../__js/*.vue")
        .pipe(
            uglify({
                toplevel: true,
                ie8: true
            })
        )
        .pipe(
            rename(function(path) {
                path.basename += "-vue";
                path.extname = ".js";
            })
        )
        .pipe(gulp.dest("../public/scripts"));
});

/**
 *	Отслеживаем изменения
 */
gulp.task("default", function() {
    jsPath.forEach(element => {
        gulp.watch("../" + element.dev + "/*.js").on(
            "change",
            gulp.series(element.name)
        );
    });

    scssPath.forEach(element => {
        gulp.watch("../" + element.dev + "/*.scss").on(
            "change",
            gulp.series(element.name)
        );
    });

    gulp.watch("../__js/*.vue").on("change", gulp.series("Vue"));
});
