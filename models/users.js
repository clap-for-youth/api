'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var basePlugin = require('./base');

var Schema = mongoose.Schema;

/**
 * User Schema
 */

var userSchema = new Schema({
    username: {type: String, default: ''},
    salt: {type: String, default: ''},
    hashed_password: {type: String, default: ''},
    changePasswordNow: {type: Boolean, default: false},
    loginCount: {type:Number, default: 0},
    lastLoginDate: Date
});
userSchema.plugin(basePlugin);
userSchema.index({username:1});

/**
 * Virtuals
 */

userSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
    return value && value.length;
};

// the below validations only apply if you are signing up traditionally

userSchema.path('username').validate(function (username) {
    if (this.skipValidation()) return true;
    return username.length;
}, 'Username cannot be blank');

userSchema.path('hashed_password').validate(function (hashed_password) {
    if (this.skipValidation()) return true;
    return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

userSchema.pre('save', function (next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashed_password) && !this.skipValidation()) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
});

/**
 * Methods
 */

userSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        console.log(this.encryptPassword(plainText));
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    ///**
    // * Validation is not required if using OAuth
    // */
    //
    //skipValidation: function() {
    //    return ~oAuthTypes.indexOf(this.provider);
    //}
};

/**
 * Statics
 */

userSchema.statics = {

    baseField: 'username',

    /**
     * Find
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    load: function (options, cb) {
        options.select = options.select || 'username';
        this.findOne(options.criteria)
            .select(options.select)
            .exec(cb);
    }
};

mongoose.model('User', userSchema);