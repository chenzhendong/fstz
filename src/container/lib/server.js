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
    domain = require('domain');

function Server() {
    this.express = express;
    this.app = app;
    var nconf = envMgr.nconf;

    this.init();

    this.host = nconf.get('server:host');
    this.port = nconf.get('server:port');

}


Server.prototype.REST_PREFIX = '/rest/v1';
Server.prototype.WEB_PREFIX = '/pages';


Server.prototype.init = function() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    //app.use(session({resave:true, saveUninitialized: true, secret: 'phalanxim', cookie: { maxAge: 60000 }}));
    //app.use(authMgr.passport.initialize());
    //app.use(authMgr.passport.session());
    //app.use(this.container.errMgr.handleRestError);

    //mapping bower libs to /public/js/lib
    var prjRoot = path.resolve(__dirname, '..', '..', '..');
    this.mappingStaticResource(path.resolve(prjRoot, 'bower_components'), '/public/lib');
};

// Add a single rest route to express.
Server.prototype.addRestRoute = function(url, apiFunc, authorizedRoles) {
    var mappingUrl = this.REST_PREFIX + url;
    log.info('Mapping rest url [', mappingUrl, ']...');
    app.use(mappingUrl, function(req, res, next) {

        global.authMgr.auth(authorizedRoles, req, function(err) {
            if (err) {
                err.isRestfulSvc = true;
                global.errMgr.handleError(err, req, res);
            }
            else {
                apiFunc(req, res, next);
            }
        });
    });
};

// Add a single page route to express.
Server.prototype.addWebRoute = function(url, apiFunc, authorizedRoles) {
    var mappingUrl = this.WEB_PREFIX + url;
    log.info('Mapping web url [', mappingUrl, ']...');
    app.use(mappingUrl, function(req, res, next) {
        global.authMgr.auth(authorizedRoles, req, function(err) {
            if (err) {
                global.errMgr.handleError(err, req, res);
            }
            else {
                apiFunc(req, res, next);
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