'use strict';
var path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    express = require('express'),
    app = express(),
    log = require('./logMgr').getLogger('server'),
    envMgr = require('./envMgr'),
    errMgr = require('./errMgr'),
    swig = require('swig'),
    domain = require('domain');

function Server() {
    this.express = express;
    this.app = app;
    var nconf = envMgr.nconf;

    this.init();

    this.host = nconf.get('server:host');
    this.port = nconf.get('server:port');

}


var REST_PREFIX = '/rest/v1';
//Server.prototype.WEB_PREFIX = '/pages';


Server.prototype.init = function() {
    app.use(bodyParser.json(), function(err, req, res, next) {
        
        if(req.originalUrl.slice(0, REST_PREFIX.length) == REST_PREFIX){
            req.isRestful = true;
        }
        
        if(err){
            err.message = 'Failed to parse the body: ' + err.message;
            err.httpStatusCode = 400;
            err.isRestfulSvc = req.isRestful;
            global.errMgr.handleError(err, req, res);
        } else {
            next();
        }
    });
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    //mapping bower libs to /public/js/lib
    var prjRoot = path.resolve(__dirname, '..', '..', '..');
    this.mappingStaticResource(path.resolve(prjRoot, 'bower_components'), '/public/lib');
    app.get('/', function(req, res, next){
        res.redirect('/web/index.html');
    });
};

// Add a single rest route to express.
Server.prototype.addRestRoute = function(url, apiFunc, route) {
    var mappingUrl = REST_PREFIX + url;
    log.info('Mapping rest url [', mappingUrl, ']...');
    app.use(mappingUrl, function(req, res, next) {

        global.authMgr.auth(route.roles, req, function(err) {
            if (err) {
                global.errMgr.handleError(err, req, res);
            }
            else {
                apiFunc(req, res, next);
            }
        });
    });
};

// Add a single page route to express.
Server.prototype.addWebRoute = function(url, apiFunc, route) {
    var mappingUrl = url;
    log.info('Mapping web url [', mappingUrl, ']...');
    app.use(mappingUrl, function(req, res, next) {
        global.authMgr.auth(route.roles, req, function(err) {
            if (err) {
                global.errMgr.handleError(err, req, res);
            }
            else {
                apiFunc(req, res, next, function(model) {
                    var view = route.view;
                    if (view && model) {
                        swig.renderFile(route.view, model, function (err, output) {
                            if(!err){
                                res.send(output).end();
                            }
                        });
                        return;
                    }
                    else if (!view) {
                        err = new Error('Cannot find html tmeplate for reqest url, check module route.js file ...');
                    }
                    else {
                        err = new Error('Cannot find data model for reqest url, check if module api.js file return data model ...');
                    }
                    err.httpStatusCode = 500;
                    global.errMgr.handleError(err, req, res);
                });
            }
        });
    });
};


//add public resources from module.
Server.prototype.mappingStaticResource = function(staticPath, mappingUrl) {
    log.info('Mapping static path[' + staticPath + '] to [' + mappingUrl + ']...');
    app.use(mappingUrl, express.static(staticPath));
};

Server.prototype.listen = function() {
    log.info('Server is listening now on [', this.host, ': ', this.port, ']...');
    app.listen(this.port, this.host);
};


module.exports = new Server();