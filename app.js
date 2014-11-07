'use strict';

var container = require('./src/container');
var userModule = require('./src/user');
var webModule = require('./src/web');

container.register(userModule);
container.register(webModule);


container.startServer();
