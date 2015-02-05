var gulp      = require('gulp'),
    gutil     = require('gulp-util'),
    rimraf    = require('gulp-rimraf');
    source    = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    sequence  = require('run-sequence'),

    // check to see if a `--prod` flag was passed to gulp
    prod      = gulp.env.prod;

// toggle the production flag without passing an argument
gulp.task('setProduction', function () {
    // set the prod variable that we added above
    prod = true;
});

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
        prefix = require('gulp-autoprefixer'),
        minify = require('gulp-minify-css');

    gulp.src('./styl/main.styl')
        .pipe(stylus({linenos: !prod}))
        .pipe(prefix())
        .pipe(prod ? minify() : gutil.noop())
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
            debug: !prod,
            noparse: ['jquery', 'lodash']
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(prod ? streamify(uglify()) : gutil.noop())
        .pipe(gulp.dest('./dist/js'));
});

// a task responsible for all compilation
gulp.task('build', ['stylus', 'js']);

// add a task that always runs `build` in production mode
gulp.task('prod', function () {
    // use the run-sequence module to make sure
    // `setProduction` happens before other tasks
    sequence('setProduction', ['stylus', 'js'])
});

gulp.task('watch', ['stylus'], function () {
    var watchify   = require('watchify'),
        browserify = require('browserify'),
        bundler    = watchify(browserify('./js/main.js', {
            cache: {},
            packageCache: {},
            fullPaths: true,
            transform: ['hbsfy'],
            debug: true,
            noparse: ['jquery', 'lodash']
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
