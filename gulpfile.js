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
    return gulp.src(['./models/*.js', './lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));

});

gulp.task('express', function () {
    var express = require('express'),
        path = require('path'),
        logger = require('morgan'),
        bodyParser = require('body-parser'),
        i18next = require('i18next'),
        app = express();
    i18next.init();

    app.use(logger('dev'));
    app.use(bodyParser.json());
    //app.use(i18next.handle);

    app.all('/*', function (req, res, next) {
        // CORS headers
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // Set custom headers for CORS
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
    app.all('/api/v1/*', [require('./lib/validateRequest')]);

    app.use('/', require('./routes'));

// If no route is matched by now, it must be a 404
    app.use(function (req, res, next) {
        res.status(404);
        res.json({
            "status": 404,
            "message": i18next.t('htmlError.404')
        });
        next();
    });

// Start the server
    app.set('port', process.env.PORT || 3000);

    var server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + server.address().port);
    });
});

gulp.task('default', ['set-env', 'jshint', 'express'], function () {

});
