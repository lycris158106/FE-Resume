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
  del('./dist');
});

gulp.task('eslint', function () {
  gulp.src('./js/resume.js')
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('font', function () {
  gulp.src(['node_modules/font-awesome/fonts/**', 'src/fonts/**'])
    .pipe(gulp.dest('./dist/fonts'))
    .pipe(reload({ stream: true }));
});

gulp.task('image', function () {
  gulp.src('./src/image/**')
    .pipe(gulp.dest('./dist/image'))
    .pipe(reload({ stream: true }));
});

gulp.task('sass', function () {
  gulp.src('./src/sass/style.scss')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 20 Chrome versions', 'Firefox >= 30']
    }))
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(reload({ stream: true }));
});

gulp.task('script', ['eslint'], function () {
  gulp.src('./src/js/*.js')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sourcemaps.init())
    .pipe(order(scriptOrder))
    .pipe(concat('common.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(reload({ stream: true }));
});

gulp.task('default', ['sass', 'script', 'image', 'font'], function () {
  browserSync.init({
    server: {
      baseDir: './'
    },
    index: 'resume.html'
  });

  gulp.watch('./src/fonts/**', ['font']);
  gulp.watch('./src/sass/**', ['sass']);
  gulp.watch('./src/js/**', ['script']);
  gulp.watch('./src/image/**', ['image']);
  gulp.watch('./resume.html').on('change', reload);
});
