'use strict';

function routeMgr(){
    
}

routeMgr.prototype.handleRoute = function(module){
    var api = module.api;
    var server = global.server;
    
    //add rest route
    var restRoutes = module.route.rest;
    for(var url in restRoutes){
        server.addRestRoute(url, api[restRoutes[url].api], restRoutes[url].roles);
    }
    
    //add web route
    var webRoutes = module.route.web;
    for(var url in webRoutes){
        server.addWebRoute(url, api[webRoutes[url].api], webRoutes[url].roles);
    }
    
};

routeMgr.prototype.register = function(module){
    this.handleRoute(module);
};

module.exports = new routeMgr();