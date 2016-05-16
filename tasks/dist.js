/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: dist
 Created Date: 16 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016 - The Workshop  All rights reserved.
 //////////////////////////////////////////////////////////////////////////////
 */
var config = require('../gulp-config.js');
var gulp = require('gulp');
var concat = require('gulp-concat');
var sequence = require('run-sequence');
var pack = require('../package.json');
var strip = require('gulp-strip-comments');
var uglify = require('gulp-uglify');

gulp.task('concat', function () {
    gulp.src(config.files)
        .pipe(concat(pack.name + '.js'))
        .pipe(strip())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function () {
    gulp.src(config.files)
        .pipe(concat(pack.name + '.min.js'))
        .pipe(strip())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});


gulp.task('dist', function() {
    sequence.apply(null, ['concat', 'minify']);
});