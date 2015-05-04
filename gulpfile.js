var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
 
gulp.task('default', function() {
	gulp.src('src/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'))
		.pipe(concat('tmpl.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});