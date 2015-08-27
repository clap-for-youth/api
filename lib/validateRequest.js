'use strict';
var jwt = require('jwt-simple'),
    err = require('../lib/errorHandler'),
    validateUser = require('./../controllers/auth').validateUser;

module.exports = function (req, res, next) {
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe.

    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    if (!token && !key) {
        err.out(res, 401);
        return;
    }
    try {
        var decoded = jwt.decode(token, require('../config/secret.js')());

        if (decoded.exp <= Date.now()) {
            err.out(res, 400);
            return;
        }

        // Authorize the user to see if s/he can access our resources

        var dbUser = validateUser(key); // The key would be the logged in user's username
        if (!dbUser && req.url.indexOf(/\/api\/v[0-9]+\/private/) >= 0) {
            err.out(res, 403);
            return;
        }
        next();

    } catch (err) {
        err.out(res, 500);
    }
};