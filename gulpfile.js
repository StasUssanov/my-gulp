const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const notify = require("gulp-notify");
const rename = require("gulp-rename");
const config = require("./my-gulp-config.json");

/**
 * SCSS
 */
config.scss.forEach(element => {
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
config.js.forEach(element => {
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
    config.js.forEach(element => {
        gulp.watch("../" + element.dev + "/*.js").on(
            "change",
            gulp.series(element.name)
        );
    });

    config.scss.forEach(element => {
        gulp.watch("../" + element.dev + "/*.scss").on(
            "change",
            gulp.series(element.name)
        );
    });

    gulp.watch("../__js/*.vue").on("change", gulp.series("Vue"));
});
