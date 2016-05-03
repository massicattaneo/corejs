// var config = require('./tasks/config.js');
// var gulp = require('gulp');
// var sequence = require('run-sequence');
// var util = require('gulp-util');

require('require-dir')('./tasks');

// Initiate development tasks
// gulp.task('default', function () {
//     var tasks = ['clean:dev', 'link:sdk', 'js:lint', 'sass:dev', 'serve:dev'];
//   
//     sequence.apply(null,tasks);
//     gulp.watch([config.paths.src.js], ['js:lint']);
//     gulp.watch([config.paths.src.scss], ['sass:dev']);
// });
