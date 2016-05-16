var config = require('../gulp-config.js');
var karma = require('karma');
var gulp = require('gulp');

gulp.task('ut', function (done) {

    var server = new karma.Server({
        configFile: __dirname + '/../karma.conf.js',
        action: 'run',
        singleRun: false,
        autoWatch: true,
        files: config.tests.concat(config.files),
        reporters: ['mocha', 'coverage'],
        preprocessors: {
            'js/**/!(*Spec).js': ['coverage']
        },
        coverageReporter: {
            type: 'text',
            dir: 'coverage/',
            subdir: '.'
        }
    }, function () {
        done();
    });


    server.start();

});

