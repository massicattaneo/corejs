var karma = require('karma');
var gulp = require('gulp');

gulp.task('ut', function (done) {

    var server = new karma.Server({
        configFile: __dirname + '/../karma.conf.js',
        reporters: ['mocha', 'html'],
        autoWatch: true
    }, function () {
        done();
    });


    server.start();

});

