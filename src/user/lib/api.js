'use strict';

var User = global.dbMgr.mongoose.model('User'),
    log = global.logMgr.getLogger('user:api');

function Api() {

}

var login = function(username, password, callback) {
    User.findOne({email: username})
        //.select('-salt -hashed_password')
        .exec(function(err, user) {
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

var register = function(form, callback) {
    
    var user = new User({
        name: form.name,
        email: form.email,
        password: form.password
    });

    User.findOne({
        email: form.email
    }).remove().exec();

    user.save(function(dberr) {
        var err;
        if (dberr) {
            switch (dberr.code) {
                case 11000:
                case 11001:
                    err = new Error('Unique username (email) exists, please login with your password.');
                    break;
                default:
                    if (dberr.errors) {
                        for (var x in dberr.errors) {
                            log.error('parameter: '+x);
                            log.error('message: '+ dberr.errors[x].message);
                            log.error('value: '+ dberr.errors[x].value);
                        }
                    }
                    err = new Error('Unexpected Error on insert new user, see log for detail...');
                    break;
            }
        } else {
            log.debug('Successfully create the user with email: '+ form.email);
        }
        return callback(err, user);
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
        res.status(200).send(req.user.toJSON()).end();
    } else {
        var err = new Error('Fail to get user infomation, unknown reason.');
        err.isRestfulSvc = true;
        err.httpStatusCode = 500;
        global.errMgr.handleError(err, req, res);
    }
};



Api.prototype.registerRest = function(req, res, next) {
    var form = req.body;
    register(form, function(err, user){
        if(err){
            err.isRestfulSvc = true;
            global.errMgr.handleError(err,req, res);
        } else {
            if(user){
                req.user = user;
                res.status(200).send(user);
            } else {
                err = new Error('User Object is null, unexpect error, check modle and db.');
                err.httpStatusCode = 500;
                err.isRestfulSvc = true;
                global.errMgr.handleError(err, req, res);
            }
        }
    });
};

module.exports = new Api();
