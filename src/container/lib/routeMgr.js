'use strict';
var path = require('path'),
    swig = require('swig'),
    log = require('./logMgr').getLogger('routeMgr');

function routeMgr() {

}

routeMgr.prototype.handleRoute = function(myModule) {
    var api = myModule.api;
    var server = global.server;

    //add rest route
    var restRoutes = myModule.route.rest;
    for (var url in restRoutes) {
        server.addRestRoute('/' + myModule.name + url, api[restRoutes[url].api], restRoutes[url]);
    }

    //add web route
    var webRoutes = myModule.route.web;
    for (var url in webRoutes) {
        server.addWebRoute('/' + myModule.name + url, api[webRoutes[url].api], webRoutes[url]);
    }

    //compile template to cache
    var viewDirPath = path.resolve(myModule.rootPath, 'view');
    server.addViewPath(viewDirPath);

};

routeMgr.prototype.register = function(myModule) {
    this.handleRoute(myModule);
};

module.exports = new routeMgr();