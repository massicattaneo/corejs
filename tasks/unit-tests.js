var config = require('../gulp-config.js');
var karma = require('karma');
var gulp = require('gulp');
var args = require('get-gulp-args')();

gulp.task('ut', function (done) {

    var files = config.tests;
    var preprocessors = {
        'js/**/!(*Spec).js': ['coverage']
    };

    if (args.test) {
        files = ['js/**/'+args.test+'Spec.js'];
        preprocessors = {};
        preprocessors['js/**/'+args.test+'.js'] = ['coverage'];
    }

    var server = new karma.Server({
        configFile: __dirname + '/../karma.conf.js',
        action: 'run',
        singleRun: false,
        autoWatch: true,
        files: files.concat(config.vendors).concat(config.files).concat(config.mocks),
        reporters: ['mocha', 'coverage'],
        preprocessors: preprocessors,
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

