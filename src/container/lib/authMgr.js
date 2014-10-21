'use strict';
var passport = require('passport');
var cache = require('node-cache');
var uuid = require("uuid");
var moment = require("moment");
var LocalStrategy = require('passport-local').Strategy;

function AuthMgr() {
    
    global.authMgr = this;
    this.passport = passport;
    this.tokenCache = cache;
    /*
    //Serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user.id);
    });

    //Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {
            var user = {
                id: '1',
                username: 'admin',
                password: 'admin',
                name: 'Zhendong Chen'
            };

            if (username !== user.username) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (password !== user.password) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }

            return done(null, user);
        }
    ));
    */
}

AuthMgr.prototype.login = function (username, password) {
    if(true){
        var token = uuid.v4();
        this.tokenCache.set(token, moment());
    } else {
        
    }
}

//token expiring on 30 min, and would be renew for each rest call
AuthMgr.prototype.authToken = function (token) {
    var timeStamp = this.tokenCache.get(token);
    if(timeStamp && moment(timeStamp).add(30, 'm').isAfter(moment())){
        this.tokenCache.set(token, moment());
        return true;
    } else {
        return false;
    }
}


module.exports = new AuthMgr();
