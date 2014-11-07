'use strict';

var User = global.dbMgr.mongoose.model('User'),
    util = require('util'),
    log = global.logMgr.getLogger('user:api');

function Api() {

}

var login = function(username, password, callback) {
    User.findOne({
        email: username
    }, function(err, user) {
        if (err) {
            //level, message, httpStatusCode, isRestfulSvc
            err.level = 'error';
            err.httpStatusCode = 500;
            return callback(err, user);
        } else {

            if (!user) {
                err = new Error('User with login name [' + username + '] is not found.');
                err.level = 'debug';
                err.httpStatusCode = 401;
                return callback(err, user);
            }
            else {
                global.authMgr.createAuthTokenInCache(user, function(err, token){
                    user.securityToken = token;
                    return callback(err, user);
                });
            }
        }
        
    });
};

Api.prototype.loginRest = function(req, res, next) {
    var form = req.body;
    login(form.username, form.password, function(err, user) {
        if (!err) {
            if (user.authenticate(form.password)) {
                res.status(200).send({
                    email: user.email,
                    securityToken: user.securityToken
                }).end();;
                return;
            }
            else {
                err = new Error('Found the user, but passowrd is not match the record.');
                err.level = 'debug';
                err.httpStatusCode = 401;
            }
        }
        err.isRestfulSvc = true;
        global.errMgr.handleError(err, req, res);
    });
};

Api.prototype.loginWeb = function(req, res, next) {
    var form = req.body;

    login(form.username, form.password, function(user) {
        if (user.authenticate(form.password)) {
            if (req.returnUrl) {
                res.redirect(req.returnUrl);
            }
            else {
                res.redirect(global.server.WEB_PREFIX + '/dashboard.html');
            }
        }
        else {
            res.redirect(global.server.WEB_PREFIX + '/index.html');
        }

    });
};

Api.prototype.profileRest = function(req, res, next) {
    if(req.user){
        res.status(200).send(req.user).end();
    } else {
        var err = new Error('Fail to get user infomation, unknown reason.');
        err.isRestfulSvc = true;
        err.httpStatusCode = 500;
        global.errMgr.handleError(err, req, res);
    }
};

Api.prototype.register = function(req, res, next) {
    var form = req.body;
    var user = new User({
        name: form.name,
        email: form.email,
        password: form.password
    });

    User.findOne({
        email: form.email
    }).remove().exec();

    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).send([{
                        msg: 'Email already exists.',
                        param: 'email'
                    }]);
                    break;
                default:
                    var modelErrors = [];

                    if (err.errors) {

                        for (var x in err.errors) {
                            modelErrors.push({
                                param: x,
                                msg: err.errors[x].message,
                                value: err.errors[x].value
                            });
                        }

                        res.status(400).send(modelErrors);
                    }
            }

            return res.status(400);
        }
        res.status(200).send({
            user: user
        }).end();
    });
};


module.exports = new Api();
