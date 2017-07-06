const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const notify = require('gulp-notify');
const order = require('gulp-order');
const plumber = require('gulp-plumber');
const pump = require('pump');
const reload = browserSync.reload;
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const scriptOrder = [
  'jquery.js',
  'jquery.fullpage.js',
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
  gulp.src(['app/src/sass/resume.scss', 'app/src/sass/print.scss'])
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
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
  pump([
    gulp.src('app/src/js/*.js'),
    plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }),
    sourcemaps.init(),
    order(scriptOrder),
    concat('resume.min.js'),
    uglify(),
    sourcemaps.write('./'),
    gulp.dest('app/dist/js'),
    reload({ stream: true }),
  ]);
});

gulp.task('default', ['sass', 'script', 'image', 'font'], function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    index: 'html/resume.html'
  });

  gulp.watch('app/src/fonts/**', ['font']);
  gulp.watch('app/src/sass/**', ['sass']);
  gulp.watch('app/src/js/**', ['script']);
  gulp.watch('app/src/image/**', ['image']);
  gulp.watch('app/html/**').on('change', reload);
});
