/* eslint-disable no-multi-str */
const browserify = require('browserify')
const del = require('del')
const gulp = require('gulp')
const source = require('vinyl-source-stream')

const header = require('gulp-header')
const rename = require('gulp-rename')
const plumber = require('gulp-plumber')
const streamify = require('gulp-streamify')
const uglify = require('gulp-uglify')
const gutil = require('gulp-util')
const connect = require('gulp-connect')
const babel = require('gulp-babel')

const pkg = require('./package.json')

const devBuild =
  process.env.NODE_ENV === 'production'
    ? ''
    : ` (dev build at ${new Date().toUTCString()})`
const distHeader =
  '/*!\n\
 * <%= pkg.name %> <%= pkg.version %><%= devBuild %> - <%= pkg.homepage %>\n\
 * <%= pkg.license %> Licensed\n\
 */\n'

const jsSrcPaths = './src/*.js*'
const jsLibPaths = './lib/*.js'

gulp.task('clean-lib', function cleanLib(cb) {
  del(jsLibPaths).then(() => cb())
})

gulp.task(
  'transpile-js',
  gulp.series('clean-lib', function transpileJS() {
    return gulp
      .src(jsSrcPaths)
      .pipe(plumber())
      .pipe(babel())
      .pipe(gulp.dest('./lib'))
  })
)

gulp.task('bundle-js', () => {
  const b = browserify(pkg.main, {
    debug: !!gutil.env.debug,
    standalone: pkg.standalone,
    detectGlobals: false
  })

  b.transform('browserify-shim')

  let stream = b
    .bundle()
    .pipe(source('spreadsheet.js'))
    .pipe(streamify(header(distHeader, { pkg, devBuild })))
    .pipe(gulp.dest('./dist'))

  if (process.env.NODE_ENV === 'production') {
    stream = stream
      .pipe(rename('spreadsheet.min.js'))
      .pipe(streamify(uglify()))
      .pipe(streamify(header(distHeader, { pkg, devBuild })))
      .pipe(gulp.dest('./dist'))
  }

  return stream
})

gulp.task('watch', function watch() {
  gulp.watch(jsSrcPaths, gulp.series('bundle-js'))
})

gulp.task('connect', function connectServer() {
  connect.server()

  gutil.log('--------------------------------------------')
  gutil.log(
    gutil.colors.magenta('To see the example, open up a browser and go')
  )
  gutil.log(gutil.colors.bold.red('to http://localhost:8080/example'))
  gutil.log('--------------------------------------------')
})

gulp.task(
  'example',
  gulp.series('transpile-js', function example() {
    return browserify('./example.js')
      .transform('babelify', { presets: ['es2015', 'react'] })
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./example'))
  })
)

gulp.task('default', gulp.parallel('bundle-js', 'connect', 'watch'))
