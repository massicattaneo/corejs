/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: dist
 Created Date: 16 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */
var config = require('../gulp-config.js');
var gulp = require('gulp');
var concat = require('gulp-concat');
var sequence = require('run-sequence');
var pack = require('../package.json');
var strip = require('gulp-strip-comments');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var pkg = require('../package.json');

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' * @author <%= pkg.author %>',
    ' */',
    ''].join('\n');

gulp.task('concat', function () {
    gulp.src(config.files)
        .pipe(concat(pack.name + '.js'))
        .pipe(strip())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function () {
    gulp.src(config.files)
        .pipe(concat(pack.name + '.min.js'))
        .pipe(strip())
        .pipe(uglify())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('./dist/'));
});


gulp.task('dist', function() {
    sequence.apply(null, ['concat', 'minify']);
});
