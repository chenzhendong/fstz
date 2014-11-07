'use strict';
var path = require('path'),
    log = require('./logMgr').getLogger('routeMgr');

function routeMgr(){
    
}

routeMgr.prototype.handleRoute = function(module){
    var api = module.api;
    var server = global.server;
    
    //add rest route
    var restRoutes = module.route.rest;
    for(var url in restRoutes){
        server.addRestRoute(url, api[restRoutes[url].api], restRoutes[url]);
    }
    
    //add web route
    var webRoutes = module.route.web;
    for(var url in webRoutes){
        /*resolve absolute path for html template*/
        if(webRoutes[url].view){
          webRoutes[url].view = path.resolve(module.rootPath, 'view', webRoutes[url].view);
          log.debug('Found view file as ['+webRoutes[url].view+']...');
        }
        server.addWebRoute(url, api[webRoutes[url].api], webRoutes[url]);
    }
    
};

routeMgr.prototype.register = function(module){
    this.handleRoute(module);
};

module.exports = new routeMgr();