'use strict';

var container = require('common');
var path  = require('path');

var server = container.server;
var nconf = container.envMgr.nconf;

server.addModule('user', path.resolve(__dirname, '..'));
