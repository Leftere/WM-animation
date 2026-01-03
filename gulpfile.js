const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

// Paths
const paths = {
    scss: {
        src: 'src/scss/**/*.scss',
        dest: 'dist/css'
    },
    js: {
        src: 'src/js/**/*.js',
        dest: 'dist/js'
    },
    html: './*.html'
};

// Compile SCSS to CSS
function styles() {
    return gulp.src('src/scss/main.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.scss.dest))
        .pipe(browserSync.stream());
}

// Concatenate and minify JS
function scripts() {
    return gulp.src(paths.js.src)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream());
}

// BrowserSync server
function serve() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch(paths.scss.src, styles);
    gulp.watch(paths.js.src, scripts);
    gulp.watch(paths.html).on('change', browserSync.reload);
}

// Build task
const build = gulp.parallel(styles, scripts);

// Default task
exports.styles = styles;
exports.scripts = scripts;
exports.build = build;
exports.serve = serve;
exports.default = gulp.series(build, serve);
