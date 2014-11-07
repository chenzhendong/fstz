'use strict';

function UserModule(){
    this.name = 'user';
    this.libPath = __dirname;
}

UserModule.prototype.init = function(){
    this.model = require('./model');
    this.api = require('./api');
    this.route = require('./route');
};

module.exports = new UserModule();
