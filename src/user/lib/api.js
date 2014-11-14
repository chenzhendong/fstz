'use strict';

var User = global.dbMgr.mongoose.model('User'),
    log = global.logMgr.getLogger('user:api'),
    _ = require('lodash');

function Api() {

}

var getUser = function(queryObj, callback) {
    User.findOne(queryObj).exec(function(err, user) {
        if (err) {
            err.httpStatusCode = 500;
            return callback(err, user);
        }
        else {
            if (!user) {
                err = new Error('User cannot be found by given criteria: [' + queryObj + ']');
                err.level = 'debug';
                err.httpStatusCode = 404;
            }
        }
        return callback(err, user);
    });
};

var login = function(username, password, callback) {
    User.findOne({
        email: username
    }).exec(function(err, user) {
        if (err) {
            err.httpStatusCode = 500;
            return callback(err, user);
        }
        else {

            if (!user) {
                err = new Error('User with login name [' + username + '] is not found.');
                err.level = 'debug';
                err.httpStatusCode = 401;
                return callback(err, user);
            }
            else {
                global.authMgr.createAuthTokenInCache(user, function(err, token) {
                    user.securityToken = token;
                    return callback(err, user);
                });
            }
        }

    });
};

var addUser = function(userEntity, callback) {

    //TODO: form vaildate, password validation, only user role is allowed
    var user = new User({
        name: userEntity.name,
        email: userEntity.email,
        password: userEntity.password,
        roles: userEntity.roles
    });

    //TODO: remove in Prod
    User.findOne({
        email: userEntity.email
    }).remove().exec();

    user.save(function(dberr) {
        var err;
        if (dberr) {
            switch (dberr.code) {
                case 11000:
                case 11001:
                    err = new Error('The Email of the new user exists ...');
                    break;
                default:
                    if (dberr.errors) {
                        for (var x in dberr.errors) {
                            log.error('parameter: ' + x);
                            log.error('message: ' + dberr.errors[x].message);
                            log.error('value: ' + dberr.errors[x].value);
                        }
                    }
                    err = new Error('Unexpected Error on creating a new user, see log for detail...');
                    break;
            }
        }
        else {
            log.debug('Successfully create the user with email: ' + userEntity.email);
        }
        return callback(err, user);
    });
};

/*---------------------------  Private APIs  --------------------------------------*/

var getUsers = function(criteria, callback) {
    User.find().sort(criteria.sort)
        .skip(criteria.skip)
        .limit(criteria.limit).exec(function(err, users) {
            if (err) {
                err.httpStatusCode = 500;
            }
            return callback(err, users);
        });
};

var updateUser = function(userDoc, callback) {
    userDoc.save(function(err) {
        if (err) {
            err.httpStatusCode = 500;
        }
        return callback(err);
    })
};

/*---------------------------  Rest APIs  --------------------------------------*/

Api.prototype.adminAddUserRest = function(req, res, next) {
    var userFromClient = req.body;

    addUser(userFromClient, function(err, userDoc) {
        if (err) {
            global.errMgr.handleError(err, req, res);
        }
        else {
            res.status(200).send(userDoc.toJSON()).end();
        }
    });

};

Api.prototype.adminUpdateUserRest = function(req, res, next) {
    var err;
    if (!req.params.id) {
        err = new Error('Cannot find user id in request url.');
        err.level = 'warn';
        err.httpStatusCode = 400;
        global.errMgr.handleError(err, req, res);
    }
    else {
        var userFromClient = req.body;

        getUser({
            _id: req.params.id
        }, function(err, userDoc) {
            if (err) {
                global.errMgr.handleError(err, req, res);
            }
            else {
                userDoc = _.extend(userDoc, userFromClient);
                updateUser(userDoc, function(errUpdate) {
                    if (errUpdate) {
                        global.errMgr.handleError(errUpdate, req, res);
                    }
                    else {
                        res.status(200).send(userDoc.toJSON()).end();
                    }
                });
            }
        });
    }
};

Api.prototype.getUsersRest = function(req, res, next) {
    var criteria = global.dbMgr.defaultCriteria;
    getUsers(criteria, function(err, users) {
        if (err) {
            global.errMgr.handleError(err, req, res);
        }
        else {
            res.status(200).send(users).end();
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
                }).end();
                return;
            }
            else {
                err = new Error('Found the user, but passowrd is not match the record.');
                err.level = 'debug';
                err.httpStatusCode = 401;
            }
        }
        global.errMgr.handleError(err, req, res);
    });
};

Api.prototype.profileRest = function(req, res, next) {
    switch (req.method) {
        case 'GET':
            if (req.userDoc) {
                res.status(200).send(req.userDoc.toJSON()).end();
            }
            else {
                var err = new Error('Fail to get user infomation, unknown reason.');
                err.httpStatusCode = 500;
                global.errMgr.handleError(err, req, res);
            }
            break;
        case 'PUT':
            req.userDoc = _.extend(req.userDoc, req.body);
            updateUser(req.userDoc, function(err) {
                if (err) {
                    global.errMgr.handleError(err, req, res);
                }
                else {
                    res.status(200).send(req.userDoc.toJSON()).end();
                }
            });
            break;
        default:
            err = new Error('The method has not been implemented yet:[' + req.method + ']');
            err.httpStatusCode = 405;
            global.errMgr.handleError(err, req, res);
    }
};


Api.prototype.registerRest = function(req, res, next) {
    var form = req.body;

    form.roles = ['user'];
    addUser(form, function(err, user) {
        if (err) {
            global.errMgr.handleError(err, req, res);
        }
        else {
            if (user) {
                req.user = user;
                res.status(200).send(user);
            }
            else {
                err = new Error('User Object is null, unexpect error, check modle and db.');
                err.httpStatusCode = 500;
                global.errMgr.handleError(err, req, res);
            }
        }
    });
};

/*---------------------------- Web APIs --------------------------------------*/

Api.prototype.registerWeb = function(req, res, next) {
    var form = req.body;

    form.roles = ['user'];
    addUser(form, function(err, user) {
        if (err) {
            global.errMgr.handleError(err, req, res);
        }
        else {
            if (user) {
                req.user = user;
                res.status(200).send(user);
            }
            else {
                err = new Error('User Object is null, unexpect error, check modle and db.');
                err.httpStatusCode = 500;
                global.errMgr.handleError(err, req, res);
            }
        }
    });
};

Api.prototype.loginWeb = function(req, res, next, callback) {
    switch(req.method){
        case 'GET':
            return callback({});
    }
    
};


module.exports = new Api();
