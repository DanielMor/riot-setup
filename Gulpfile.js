var gulp = require('gulp');
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
  tag: {
    files: './src/tags/**.tag',
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

gulp.task('watch', function(callback) {
  runSequence(['watch-js', 'watch-html', 'watch-tag'], callback);
});

gulp.task('default', [ 'html', 'browserify', 'server', 'watch']);
