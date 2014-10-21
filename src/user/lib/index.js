'use strict';

function User(){
    this.name = 'user';
    this.libPath = __dirname;
    this.restRoute = require('./restRoute');
}

module.exports = new User();
