const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync  = require('browser-sync');
const pug          = require('pug');
const gulpPug      = require('gulp-pug');
const sass         = require('gulp-sass');
const babel        = require('gulp-babel');
const print        = require('gulp-print');
const cache        = require('gulp-cached');

gulp.task('libs', function(){
      return gulp.src([
        'node_modules/systemjs/dist/system.js',
        'node_modules/babel-polyfill/dist/polyfill.js',
        'node_modules/gsap/src/minified/TweenMax.min.js'])
        .pipe(print())
        .pipe(gulp.dest('build/js/libs'));
});


gulp.task('sass', function () {
    return gulp.src('assets/css/main.scss')
        .pipe(cache('sassing'))
        .pipe(print())
        .pipe(sass({
            includePaths: ['css']
        }))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 9'], { cascade: true }))
        .pipe(gulp.dest('build'));
        // .pipe(gulp.dest('sass'));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'build'
        }
    });
});

gulp.task('pug', function(){
  return gulp.src('views/*.pug')
    .pipe(cache('puging'))
    .pipe(print())
    .pipe(gulpPug({
      pug: pug,
      pretty: true
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('js', function(){
  return gulp.src('assets/es6/*.js')
        .pipe(cache('jsing'))
        .pipe(print())
        .pipe(babel({presets:['es2015']}))
        .pipe(gulp.dest('build/js'));
});

gulp.task('watch', ['browserSync'], function(){
  // gulp.watch('assets/css/*.scss', ['saas']);
  gulp.watch('views/*.pug', ['pug']);
  gulp.watch('assets/es6/*.js', ['js']);
  gulp.watch('assets/css/**', ['sass']);
  gulp.watch('build/**', browserSync.reload);
});

gulp.task('default', ['watch']);
