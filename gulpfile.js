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
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const reload = browserSync.reload;

const scriptOrder = [
  'jquery.js',
  'jquery.fullpage.js',
  'resume.js',
];

gulp.task('clean', () => {
  del('app/dist');
});

gulp.task('eslint', () => {
  pump([
    gulp.src('app/js/resume.js'),
    eslint({
      useEslintrc: true,
    }),
    eslint.format(),
    eslint.failAfterError(),
  ]);
});

gulp.task('font', () => {
  pump([
    gulp.src(['node_modules/font-awesome/fonts/**', 'app/src/fonts/**']),
    gulp.dest('app/dist/fonts'),
    reload({
      stream: true,
    }),
  ]);
});

gulp.task('image', () => {
  pump([
    gulp.src('app/src/images/**'),
    gulp.dest('app/dist/images'),
    reload({ stream: true }),
  ]);
});

gulp.task('sass', () => {
  pump([
    gulp.src(['app/src/sass/resume.scss', 'app/src/sass/print.scss']),
    plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }),
    sourcemaps.init(),
    sass({
      precision: 10,
    }),
    autoprefixer({
      browsers: ['last 10 Chrome versions', 'Firefox >= 40'],
    }),
    cssnano(),
    rename({
      suffix: '.min',
    }),
    sourcemaps.write('./'),
    gulp.dest('app/dist/css'),
    reload({ stream: true }),
  ]);
});

gulp.task('script', ['eslint'], () => {
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

gulp.task('default', ['sass', 'script', 'image', 'font'], () => {
  browserSync.init({
    server: {
      baseDir: 'app',
    },
    index: 'html/resume.html',
  });

  gulp.watch('app/src/fonts/**', ['font']);
  gulp.watch('app/src/sass/**', ['sass']);
  gulp.watch('app/src/js/**', ['script']);
  gulp.watch('app/src/images/**', ['image']);
  gulp.watch('app/html/**').on('change', reload);
});
