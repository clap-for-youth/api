'use strict';
var fs = require('fs'),
    mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/test');

var db = mongoose.connection;

fs.readdirSync(__dirname + '/../models').forEach(function (file) {
    if (~file.indexOf('.js')) require(__dirname + '/../models/' + file);
});

module.exports = db;