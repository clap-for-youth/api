var express = require('express');
var router = express.Router();

var auth = require('./auth');
var assessment = require('./assessment');

/*
 * Auth Router
 */
router.post('/login', auth.login);

/*
 * Assessment Router
 */
router.get('/api/v1/private/assessments', assessment.getAll);
router.get('/api/v1/private/assessment/:code', assessment.getOne);
//router.post('/api/v1/admin/user/', user.create);
//router.put('/api/v1/admin/user/:id', user.update);
//router.delete('/api/v1/admin/user/:id', user.delete);

module.exports = router;