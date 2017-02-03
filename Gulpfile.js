var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var runSequence = require('run-sequence');
var riotify = require('riotify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var server = require('gulp-server-livereload');
var open = require('gulp-open');

var config = {
  build: './build/',
  js: {
    build: './build/js',
    files: './src/index.js',
    output: 'main-bundle.js',
  },
  html: {
    mainFile: './src/index.html',
    build: './build/',
  },
  style: {
    build: './build/css',
    files: './src/style/**/*.sass',
  },
  tag: {
    files: './src/tags/**/*.tag',
  },
  server: {
    port: 9000,
  },
  proxies: [{
    source: '/api',
    target: 'http://localhost:80/api',
  }]
};

gulp.task('browserify', function() {
  return browserify({
    debug: true,
    entries: [ config.js.files ],
  })
  .transform(babelify, { presets: [ "es2015-riot" ]})
  .transform(riotify)
  .bundle()
  .pipe(source(config.js.output))
  .pipe(gulp.dest(config.js.build));
});

gulp.task('html', function() {
  return gulp.src(config.html.mainFile)
    .pipe(gulp.dest(config.html.build))
});

gulp.task('materialize-css', function() {
  return gulp.src('./node_modules/materialize-css/dist/**/*')
    .pipe(gulp.dest(config.html.build));
});

gulp.task('font-awesome-fonts', function() {
  return gulp.src('./node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest(config.html.build + '/fonts/'));
});

gulp.task('font-awesome-css', function() {
  return gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest(config.style.build));
});

gulp.task('style', function() {
  return gulp.src(config.style.files)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.style.build))
});

gulp.task('server', function() {
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

gulp.task('watch', function(callback) {
  runSequence(['watch-js', 'watch-html', 'watch-tag', 'watch-style'], callback);
});

gulp.task('default', [ 'html', 'materialize-css', 'font-awesome-fonts', 'font-awesome-css', 'style', 'browserify', 'server', 'watch']);
