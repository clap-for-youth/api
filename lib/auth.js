'use strict';

var jwt = require('jwt-simple'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    err = require('./errorHandler');

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        //iss: user.id,
        exp: expires
    }, require('../config/secret')());

    return {
        token: token,
        expires: expires,
        user: user
    };
}

var auth = {

    login: function(req, res, next) {

        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username === '' || password === '') {
            err(res, 401);
            return;
        }

        // Fire a query to your DB and check if the credentials are valid
        User.findOne({username: username}).exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + username));

            res.json(genToken(user));
        });


        //var dbUserObj = auth.validate(username, password);
        //
        //if (!dbUserObj) { // If authentication fails, we send a 401 back
        //    err(res, 401);
        //    return;
        //}
        //
        //if (dbUserObj) {
        //
        //    // If authentication is success, we will generate a token
        //    // and dispatch it to the client
        //
        //}

    },

    validate: function(username, password) {
        var user = User.findOne({username: username});
        if (!user) {
            return false;
        }
        console.log(user);
        var dbUserObj = user.authenticate(password);
        return dbUserObj;
    },

    validateUser: function(username) {
        var dbUserObj = User.findOne({username: username});
        return dbUserObj;
    },
};

module.exports = auth;