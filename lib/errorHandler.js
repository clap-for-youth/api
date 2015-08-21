'use strict';

var i18next = require('i18next');

module.exports = function (res, status, message) {
    res.status(status);
    res.json({
        status: status,
        message: message || i18next.t('htmlError.' + status)
    });
    res.end();
};