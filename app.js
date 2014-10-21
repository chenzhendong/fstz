'use strict';

var container = require('./src/container');
var user = require('./src/user');
var web = require('./src/web');

container.register(web);
container.register(user);
