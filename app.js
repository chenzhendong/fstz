'use strict';

var container = require('./src/container');
var userModule = require('./src/user');
var webModule = require('./src/web');

container.register(webModule);
container.register(userModule);

container.startServer();
