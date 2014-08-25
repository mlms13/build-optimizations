var gulp      = require('gulp'),
    gutil     = require('gulp-util'),
    rimraf    = require('gulp-rimraf');
    source    = require('vinyl-source-stream'),
    streamify = require('gulp-streamify');

// cleaning tasks
gulp.task('cleanjs', function () {
    gulp.src('./dist/js')
        .pipe(rimraf());
});

gulp.task('cleancss', function () {
    gulp.src('./dist/css')
        .pipe(rimraf());
});

gulp.task('stylus', ['cleancss'], function () {
    var stylus = require('gulp-stylus'),
        prefix = require('gulp-autoprefixer');

    gulp.src('./styl/main.styl')
        .pipe(stylus({linenos: true}))
        .pipe(prefix())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('hint', function () {
    var cached  = require('gulp-cached'),
        jshint  = require('gulp-jshint'),
        stylish = require('jshint-stylish');

    return gulp.src('./js/**/*.js')
        .pipe(cached('hinting'))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('js', ['cleanjs', 'hint'], function () {
    var browserify = require('browserify'),
        uglify     = require('gulp-uglify');

    return browserify('./js/main.js', {
            transform: ['hbsfy'],
            debug: true
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./dist/js'));
});

// a task responsible for all compilation
gulp.task('build', ['stylus', 'js']);


gulp.task('watch', ['stylus'], function () {
    var watchify   = require('watchify'),
        browserify = require('browserify'),
        bundler    = watchify(browserify('./js/main.js', {
            cache: {},
            packageCache: {},
            fullPaths: true,
            transform: ['hbsfy'],
            debug: true
        }));

    function rebundle() {
        var t = Date.now();
        gutil.log('Starting Watchify rebundle');
        return bundler.bundle()
            .pipe(source('main.js'))
            .pipe(gulp.dest('./dist'))
            .on('end', function () {
                gutil.log('Finished bundling after:', gutil.colors.magenta(Date.now() - t + ' ms'));
            });
    }
    bundler.on('update', rebundle);
    gulp.watch('./js/**/*.js', ['hint']);
    gulp.watch('./styl/**/*.styl', ['stylus']);

    return rebundle();
});

gulp.task('default', ['build']);
