module.exports = {
  build: './build/',
  js: {
    build: './build/js',
    mainFile: './src/index.js',
    files: './src/**/*.js',
    output: 'main-bundle.js',
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
  }],
  html: {
    mainFile: './src/index.html',
  }
};