var gulp = require('gulp');

gulp.task('stylus', function () {
    var stylus = require('gulp-stylus'),
        prefix = require('gulp-autoprefixer');

    gulp.src('./styl/main.styl')
        .pipe(stylus({linenos: true}))
        .pipe(prefix())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('hint', function () {
	var jshint  = require('gulp-jshint'),
		stylish = require('jshint-stylish');

	return gulp.src('./js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('js', ['hint'], function () {
	var browserify = require('gulp-browserify'),
		uglify     = require('gulp-uglify');

	return gulp.src('./js/main.js')
		.pipe(browserify({
			transform: ['hbsfy'],
			debug: true
		}))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
});

gulp.task('default', ['stylus', 'js']);