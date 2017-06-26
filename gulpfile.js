var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var del = require('del');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var notify = require('gulp-notify');
var order = require('gulp-order');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var scriptOrder = [
  'jquery.js',
  'resume.js'
];

gulp.task('clean', function () {
  del('app/dist');
});

gulp.task('eslint', function () {
  gulp.src('app/js/resume.js')
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('font', function () {
  gulp.src(['node_modules/font-awesome/fonts/**', 'app/src/fonts/**'])
    .pipe(gulp.dest('app/dist/fonts'))
    .pipe(reload({ stream: true }));
});

gulp.task('image', function () {
  gulp.src('app/src/image/**')
    .pipe(gulp.dest('app/dist/image'))
    .pipe(reload({ stream: true }));
});

gulp.task('sass', function () {
  gulp.src('app/src/sass/resume.scss')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      precision: 10
    }))
    .pipe(autoprefixer({
      browsers: ['last 10 Chrome versions', 'Firefox >= 40']
    }))
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/dist/css'))
    .pipe(reload({ stream: true }));
});

gulp.task('script', ['eslint'], function () {
  gulp.src('app/src/js/*.js')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sourcemaps.init())
    .pipe(order(scriptOrder))
    .pipe(concat('resume.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/dist/js'))
    .pipe(reload({ stream: true }));
});

gulp.task('default', ['sass', 'script', 'image', 'font'], function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    index: 'resume.html'
  });

  gulp.watch('app/src/fonts/**', ['font']);
  gulp.watch('app/src/sass/**', ['sass']);
  gulp.watch('app/src/js/**', ['script']);
  gulp.watch('app/src/image/**', ['image']);
  gulp.watch('app/resume.html').on('change', reload);
});
