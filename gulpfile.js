"use strict";

var gulp = require('gulp');

gulp.task('set-env', function () {
    var env = require('gulp-env');
    env({
        file: "./config/main.js",
        vars: {
            //any vars you want to overwrite
        }
    });
});

gulp.task('jshint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src(['./models/*.js', './lib/*.js', './test/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('mocha', function () {
    var mocha = require('gulp-mocha');
    return gulp.src('./test/test-*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('express', function () {
    var app = require('./app'),
        server = app.listen(app.get('port'), function () {
            console.log('Express server listening on port ' + server.address().port);
        });
});

gulp.task('test', ['set-env', 'jshint', 'mocha'], function () {
});
gulp.task('default', ['set-env', 'jshint', 'express'], function () {
});