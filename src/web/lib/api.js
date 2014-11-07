'use strict';

var util = require('util'),
    log = global.logMgr.getLogger('user:api');

function Api() {

}



Api.prototype.homePage = function(req, res, next, callback) {
    var model = {};
    model.hello ='Hello, world!!!';
    return callback(model);
};


module.exports = new Api();
