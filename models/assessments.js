'use strict';
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var basePlugin = require('./base');
var Schema = mongoose.Schema;

/**
 * Choice Schema
 */
var choiceSchema = new Schema({
    option: Number,
    value: String
});

/**
 * Question Schema
 */
var questionSchema = new Schema({
    question: String,
    type: String,
    questionNumber: Number,
    questionNumberInCat: Number,
    choice: [choiceSchema]
});

/**
 * Category Schema
 */
var categorySchema = new Schema({
    name: String,
    code: String,
    description: String
});

/**
 * Assessment Schema
 */

var assessmentSchema = new Schema({
    name: String,
    shortName: String,
    categories: [categorySchema],
    questions: [questionSchema]
});
assessmentSchema.plugin(basePlugin);


/**
 * Methods
 */

assessmentSchema.methods = {};

/**
 * Statics
 */

assessmentSchema.statics = {

    baseField: 'name,shortName',

    /**
     * Find All
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    loadAll: function (options, cb) {
        options.select = options.select || this.baseField;
        this.find(options.criteria)
            .select(options.select)
            .exec(cb);
    },

    /**
     * Find
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    load: function (options, cb) {
        options.select = options.select || 'name';
        this.findOne(options.criteria)
            .select(options.select)
            .exec(cb);
    }

};

mongoose.model('Assessment', assessmentSchema);