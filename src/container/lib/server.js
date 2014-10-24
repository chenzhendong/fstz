'use strict';
var envMgr = require('./envMgr');
var apiMgr = require('./apiMgr');
var authMgr = require('./authMgr');
var errMgr = require('./errMgr');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var express = require('express');
var app = express();

var REST_PREFIX = '/rest/v1';
var PAGE_PREFIX = '/pages';

function Server() {
    this.express = express;
    this.app = app;
    this.modules = {};
    var nconf = envMgr.nconf;
    
    this.configure();
    
    var host = nconf.get('server:host');
    var port = nconf.get('server:port');
    
    app.listen(port, host);
}


Server.prototype.configure = function() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }) );
    //app.use(session({resave:true, saveUninitialized: true, secret: 'phalanxim', cookie: { maxAge: 60000 }}));
    //app.use(authMgr.passport.initialize());
    //app.use(authMgr.passport.session());
    app.use(errMgr.handleRestError);
}

// Add a single rest route to express.
Server.prototype.addRestRoute =  function(url, apiName) {
    url = REST_PREFIX + url;
    console.log('Mapping rest url [' + url + '] to api [' + apiName+ ']...');
    this.app.use(url, function(req,res,next){
        return apiMgr.api[apiName](req,res,next);
    });
}

// Add a single page route to express.
Server.prototype.addPageRoute =  function(url, callback) {
    url = PAGE_PREFIX + url;
    console.log('Mapping page url [' + url + ']...');
    this.app.use(url, function(req,res,next){
        return callback(req,res,next);
    });
}

//call restRoute function handle to add rest services for the module.
Server.prototype.addRestRoutesFromModule = function(restRoute){
    restRoute(this);
}

//add public resources from module.
Server.prototype.mappingStaticResource = function(staticPath, mappingUrl){
    console.log('Mapping static path[' + staticPath + '] to ['+ mappingUrl +']...');
    app.use(mappingUrl, express.static(staticPath));
}


module.exports = new Server();