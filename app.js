'use strict';

var container = require('./src/container');
var userModule = require('./src/user');

container.register(userModule);


container.startServer();
