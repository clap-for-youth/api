/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Assessment = mongoose.model('Assessment');
var hel = require('../helpers/queryHelper');

mongoose.set('debug', true);

module.exports = {

    getAll: function (req, res, next) {
        var query = Assessment.find({});

        query = hel.prepareQuery(query, req.params);
        query.exec(function (err, assessments) {
                if (err) {
                    return next(err);
                }
                if (!assessments.length) {
                    err(res, 404);
                    return;
                }

                res.json(assessments);
                res.end();
            });

    },

    getOne: function (req, res, next) {

        var code = req.params.code;
        var query = Assessment.find({code: code})

        query = hel.prepareQuery(query, req.params);
        query.exec(function (err, assessment) {
                if (err) {
                    return next(err);
                }
                if (!assessment) {
                    err(res, 404);
                    return;
                }

                res.json(assessment);
                res.end();

            });

    }

};