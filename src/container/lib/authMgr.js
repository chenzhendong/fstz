'use strict';
var passport = require('passport'),
    cacheMgr = require('./cacheMgr'),
    crypto = require('crypto'),
    log = require('./logMgr').getLogger('authMgr'),
    uuid = require("uuid");


function AuthMgr() {}

/**
 * Create a authentication token, and put it in cache, so the restful service and
 * web session could use token for a quick authentication.
 * */
AuthMgr.prototype.createAuthTokenInCache = function(user, callback) {
    //TODO: add uuid as radom seed to get unique session token
    //var token = crypto.createHash('sha1').update(user.toString() + uuid.v4()).digest('base64');
    var token = crypto.createHash('sha1').update(user.toString()).digest('base64');
    var err;
    if(!global.cacheMgr.set(token, user)){
        err = new Error('Failed to set token on cache ...');
    }
    return callback(err, token);
};

/* Get user from the authentication token in cache */
AuthMgr.prototype.getUserByToken = function(token) {
    return global.cacheMgr.get(token);
};

/*Compare required role list with user role list, if one role match, grant the access  */
AuthMgr.prototype.auth = function(requiredRoles, req, callback) {
    var err;
    if (requiredRoles && requiredRoles.length > 0) {
        var token = req.header('Authorization');
        if (token) {
            var user = cacheMgr.get(token);
            if(user){
                req.userDoc = user;
                for(var idx in requiredRoles){
                    if (user.hasRole(requiredRoles[idx])) {
                        return callback(err);
                    }
                }
                err = new Error('User\'s role don\'t have authority to visit the url [' + req.originalUrl + ']...');
            } else {
                err = new Error('Security token missing / expired, please relogin with username / password, unauthorized visit to url [' + req.originalUrl + ']...');
            }
        } else {
            err = new Error('Cannot found token in request header, unauthorized visit to url [' + req.originalUrl + ']...');
        }
    } else {
        return callback(err);
    }
    
    if(err){
        err.httpStatusCode = 401;
        err.level = 'warn';
        return callback(err);
    }
};



/*token expiring on 30 min, and would be renew for each rest call
AuthMgr.prototype.authToken = function (token) {
    var timeStamp = this.tokenCache.get(token);
    if(timeStamp && moment(timeStamp).add(30, 'm').isAfter(moment())){
        this.tokenCache.set(token, moment());
        return true;
    } else {
        return false;
    }
}
*/

module.exports = new AuthMgr();
