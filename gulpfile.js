var gulp = require('gulp');
var useref = require('gulp-useref');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var gzip = require('gulp-gzip');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function(done) {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });
  done();
});

gulp.task('sass', function() {
  return gulp
    .src('app/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('app/css'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task('compress:html', function() {
  return gulp
    .src('dist/index.html')
    .pipe(concat('index.html'))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('compress:js', function() {
  return gulp
    .src('dist/js/*js')
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('compress:css', function() {
  return gulp
    .src('dist/css/*css')
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(concat('styles.min.css'))
    .pipe(
      cleanCSS({ debug: true, level: 2 }, function(details) {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(gulp.dest('dist/css'));
});

gulp.task('useref', function() {
  return gulp
    .src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', concat('js/index.min.js')))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp
    .src('app/images/**/*.+(png|jpg|gif|svg|ico)')
    .pipe(
      cache(
        imagemin({
          interlaced: true
        })
      )
    )
    .pipe(gulp.dest('dist/images'));
});

gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
});

gulp.task('clean:dist', function() {
  return del(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task(
  'watch',
  gulp.parallel('browserSync', 'sass', function() {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('app/*.html').on('change', browserSync.reload);
    gulp.watch('app/js/**/*.js').on('change', browserSync.reload);
  })
);

gulp.task('docs', function() {
  return gulp
    .src('app/docs/*.+(pdf|docx|txt)')
    .pipe(gulp.dest('dist/docs'))
})

gulp.task('default', gulp.series('watch'));

gulp.task(
  'build',
  gulp.series(
    'clean:dist',
    'sass',
    'useref',
    gulp.parallel('compress:html', 'compress:css', 'images', 'docs'),
    function(done) {
      done();
    }
  )
);
