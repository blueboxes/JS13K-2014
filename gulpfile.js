var gulp = require('gulp'), 
uglify = require('gulp-uglify'),
concat = require('gulp-concat'),
zip = require('gulp-zip'),
cssmin = require('gulp-cssmin'),
htmlmin = require('gulp-htmlmin'),
rimraf = require('gulp-rimraf'),
size = require('gulp-size');

gulp.task('default', ['build']);
gulp.task('build', ['build_source', 'build_images','build_index', 'build_styles','compress']);

gulp.task('build_source', function() {
  return gulp.src('src/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
});

gulp.task('build_index', function() {
	return gulp.src('src/index.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true}))
    .pipe(gulp.dest('build'));
});

gulp.task('build_styles', function() {
	return gulp.src('src/styles.css')
    .pipe(cssmin())
    .pipe(gulp.dest('build'));
});

gulp.task('build_images', function() {
  return gulp.src('src/*.png')
    .pipe(gulp.dest('build'));
});

gulp.task('compress', function() {
 return gulp.src('build/*.*')
    .pipe(zip('archive.zip'))
    .pipe(size())
    .pipe(gulp.dest('build'))
});

gulp.task('clean', function () {
    return gulp.src('build/*.*', {read: false})
          .pipe(rimraf());
});

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['lint', 'build_source']);
  gulp.watch('src/styles.css', ['build_styles']);
  gulp.watch('src/index.html', ['build_index']);
});