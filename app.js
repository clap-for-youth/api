'use strict';
var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    i18next = require('i18next'),
    errHandler = require('./lib/errorHandler'),
    db = require('./lib/db'),
    app = express();

// init language
i18next.init();

app.use(logger('dev'));
app.use(bodyParser.json());

app.all('/*', function (req, res, next) {
// init db connection
    db.on('error', function() {
        errHandler.out(res, 500, 'database connection error');
    });
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method === 'OPTIONS') {
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

app.use('/', require('./controllers/index'));

// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
    errHandler.out(res, 404);
    next();
});

// error handler
app.use(function(err, req, res, next) {
    errHandler.out(res, 500, err.message);
    console.error(err.stack);
    next();
});

// Start the server
app.set('port', process.env.PORT || 3000);

module.exports = app;