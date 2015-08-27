'use strict';
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
//should = require('should'),
    request = require('supertest'),
    app = require('../app'),
    User = mongoose.model('User');

var count;

/**
 * Users tests
 */

describe('Auth.', function () {
    describe('POST /login', function () {
        describe('Invalid parameters', function () {
            before(function (done) {
                User.count(function (err, cnt) {
                    count = cnt;
                    done();
                });
            });

            it('no password - should respond with errors', function (done) {
                request(app)
                    .post('/login')
                    .send({
                        'username': 'test'
                    })
                    .expect(400)
                    .end(done);
            });

            it('no username - should respond with errors', function (done) {
                request(app)
                    .post('/login')
                    .send({
                        'password': 'test2015'
                    })
                    .expect(400)
                    .end(done);
            });

            it('wrong password - should respond with errors', function (done) {
                request(app)
                    .post('/login')
                    .send({
                        'username': 'test',
                        'password': 'test2016'
                    })
                    .expect(401)
                    .end(done);
            });

            it('no this page - should respond with errors', function (done) {
                request(app)
                    .post('/userlogin')
                    .field('username', 'test2015')
                    .field('password', 'test2015')
                    .expect(404)
                    .end(done);
            });

            it('no this user - should respond with errors', function (done) {
                request(app)
                    .post('/login')
                    .send({
                        'username': 'test2',
                        'password': 'test2015'
                    })
                    .expect(400)
                    .end(done);
            });

            it('no get method - should respond with errors', function (done) {
                request(app)
                    .get('/login')
                    .send({
                        'username': 'test',
                        'password': 'test2015'
                    })
                    .expect('Content-Type', /json/)
                    .expect(404)
                    //.expect(/Email cannot be blank/)
                    .end(done);
            });
        });

        describe('Valid parameters', function () {
            before(function (done) {
                User.count(function (err, cnt) {
                    count = cnt;
                    done();
                });
            });

            it('no this user - should respond with no errors', function (done) {
                request(app)
                    .post('/login')
                    .send({
                        'username': 'test',
                        'password': 'test2015'
                    })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    //.expect(/Email cannot be blank/)
                    .end(done);
            });
        });
    });

    after(function (done) {
        done();
        //require('./helper').clearDb(done);
    });
});