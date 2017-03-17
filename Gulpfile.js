const gulp = require('gulp');
const sass = require('gulp-sass');
const browserify = require('browserify');
const runSequence = require('run-sequence');
const riotify = require('riotify');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const server = require('gulp-server-livereload');
const open = require('gulp-open');

let config = require('./config');

gulp.task('browserify', () => {
  return browserify({
    debug: true,
    entries: [ config.js.mainFile ],
  })
  .transform(babelify, { presets: [ 'es2015-riot' ]})
  .transform(riotify)
  .bundle()
  .pipe(source(config.js.output))
  .pipe(gulp.dest(config.js.build));
});

gulp.task('html', () => {
  return gulp.src(config.html.mainFile)
    .pipe(gulp.dest(config.build))
});

gulp.task('images', () => {
  return gulp.src('./src/images/**/*')
    .pipe(gulp.dest(config.build + '/images/'));
});

gulp.task('materialize-css', () => {
  return gulp.src('./node_modules/materialize-css/dist/**/*')
    .pipe(gulp.dest(config.build));
});

gulp.task('font-awesome-fonts', () => {
  return gulp.src('./node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest(config.build + '/fonts/'));
});

gulp.task('font-awesome-css', () => {
  return gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest(config.style.build));
});

gulp.task('style', () => {
  return gulp.src(config.style.files)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.style.build))
});

gulp.task('server', ['build'], () => {
  gulp.src(config.build)
    .pipe(server({
      port: config.server.port,
      fallback: 'index.html',
      livereload: true,
      proxies: config.proxies,
      host: '0.0.0.0',
    }))
    .pipe(open({
      uri: 'http://localhost:' + config.server.port,
    }));
});

gulp.task('watch-html', gulp.watch.bind(gulp, config.html.mainFile, ['html']));
gulp.task('watch-js', gulp.watch.bind(gulp, config.js.files, ['browserify']));
gulp.task('watch-tag', gulp.watch.bind(gulp, config.tag.files, ['browserify']));
gulp.task('watch-style', gulp.watch.bind(gulp, config.style.files, ['style']));

gulp.task('watch', (callback) => {
  runSequence(['watch-js', 'watch-html', 'watch-tag', 'watch-style'], callback);
});

gulp.task('build', [ 'html', 'materialize-css', 'font-awesome-fonts', 'font-awesome-css', 'style', 'images', 'browserify']);

gulp.task('default', [ 'build', 'server', 'watch']);